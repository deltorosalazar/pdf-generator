/* eslint-disable max-len */
/* eslint-disable indent */
require('dotenv').config();

const express = require('express');
const http = require('http');
const { urlencoded, json } = require('body-parser');
const helmet = require('helmet');
const cors = require('cors');
const morgan = require('morgan');

const app = express();
const generatePdf = require('./services/generatePDF');
const {
  computeResults,
  generateChart,
  readSheets,
  readFullSheet
} = require('./services');

const { REPORTS, FORMS } = require('./shared/constants');
const Logger = require('./shared/Logger');

const createSqsClient = require('./helpers/aws/sqs');
const sendMail = require('./helpers/aws/ses');

const requiredParams = require('./middlewares/params').handler;
const { CLIENT_INVALID_OPTION } = require('./shared/constants/error_codes');
const MaikaError = require('./shared/MaikaError');

const getMetadata = (report, results) => {
  const formsKeys = Object.keys(report.forms);
  const initialReport = results[formsKeys[0]];

  return {
    date: initialReport['Fecha'],
    patientName: initialReport['Nombre del Paciente']
  };
};

const baseFunction = async (patientID, reportToGenerate, generateBase64 = false) => {
  try {
    const results = await readSheets(patientID, reportToGenerate);
    let metadata = {};

    // For debugging purposes.
    Logger.log(JSON.stringify({ results }, null, 2));

    if (results instanceof Error) throw new Error(results);

    let computedResults = null;

    computedResults = await computeResults(reportToGenerate, results);

    metadata = {
      ...getMetadata(reportToGenerate, results),
      id: patientID,
      report: reportToGenerate.id
    };

    // For debugging purposes.
    Logger.log(JSON.stringify({ computedResults }, null, 2));

    const { computedForms, forms } = reportToGenerate;
    const formsKeys = [...Object.keys(forms), ...Object.keys(computedForms || {})];

    const resultsCharts = await Promise.all(
      formsKeys
        .map((formID) => {
          const form = reportToGenerate.forms[formID] ? reportToGenerate.forms[formID] : reportToGenerate.computedForms[formID];

          return form.chartConfig ? generateChart(form.chartConfig.type, computedResults[formID], form.chartConfig) : Promise.resolve(undefined);
        })
    );

    const resultsWithCharts = Object.keys(computedResults).reduce((accumulatedResults, formID, index) => {
      const form = reportToGenerate.forms[formID] ? reportToGenerate.forms[formID] : reportToGenerate.computedForms[formID];

      return {
        ...accumulatedResults,
        [formID]: {
          ...accumulatedResults[formID],
          chart: resultsCharts[index],
          tableBounds: form.tableBounds
        }
      };
    }, computedResults);

    Logger.log(JSON.stringify({ resultsWithCharts }, null, 2));

    const pdf = await generatePdf(reportToGenerate, resultsWithCharts, generateBase64);

    return { pdf, metadata };
  } catch (error) {
    // console.log({ error });
    // return res.status(500).json({
    //   method: 'computeResults'
    // });

    return Promise.reject(error);
  }
};

app
  .use(helmet())
  .use(cors())
  .use(urlencoded({ extended: true }))
  .use(json())
  .use(
    morgan((tokens, req, res) => {
      return [
        tokens.method(req, res),
        tokens.url(req, res),
        tokens.status(req, res),
        tokens.res(req, res, 'content-length'),
        '-',
        tokens['response-time'](req, res),
        'ms'
      ].join(' ');
    })
  );

app.get('/', (_, res) => {
  return res.status(200).json({
    env: app.get('env')
  });
});

app.post('/', requiredParams(['id', 'report']), async (req, res) => {
  const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;

  try {
    const { id, report } = body;
    const reportToGenerate = REPORTS[report];

    // For debugging purposes.
    Logger.log({ reportToGenerate });

    if (!reportToGenerate) {
      throw new MaikaError(
        400,
        `Este reporte no existe [${report}].`,
        CLIENT_INVALID_OPTION,
        {
          received: report,
          expected: Object.keys(REPORTS)
        }
      );
    }

    const { pdf } = await baseFunction(id, reportToGenerate);

    pdf.pipe(res);

    // return res.writeHead(200, {
    //   'Content-Type': 'application/pdf',
    //   'Access-Control-Allow-Origin': '*',
    //   'Content-Disposition': `inline; filename=${computedResults.date}-${computedResults.patientName}.pdf`
    // });
  } catch (error) {
    return res.status(error.httpStatusCode).json({
      timestamp: Date.now(),
      status: error.httpStatusCode,
      messages: [
        error.message
      ],
      data: error.data
    });
  }
});

// Endpoint to return file in base64
app.post('/base', requiredParams(['id', 'report']), async (req, res) => {
  const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;

  try {
    const { id, report } = body;
    const reportToGenerate = REPORTS[report];

    // For debugging purposes.
    Logger.log({ reportToGenerate });

    if (!reportToGenerate) {
      throw new MaikaError(
        400,
        `Este reporte no existe [${report}].`,
        CLIENT_INVALID_OPTION,
        {
          received: report,
          expected: Object.keys(REPORTS)
        }
      );
    }

    const { pdf, metadata } = await baseFunction(id, reportToGenerate, true);

    return res.status(200).json({
      message: 'Base64 report generated successfuly',
      file: pdf,
      metadata
    });
  } catch (error) {
    return res.status(error.httpStatusCode).json({
      timestamp: Date.now(),
      status: error.httpStatusCode,
      messages: [
        error.message
      ],
      data: error.data
    });
  }
});

// app.post('/bulk-emails', requiredParams(['startDate', 'endDate']), async (req, res) => {
app.post('/bulk-emails', async (req, res) => {
  const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;

  // const { sqs_account_id = 000000000000, sqs_queue_name = "queue-maika" } = process.env

  try {
    // const { id, report, email } = body;

    const { startDate, endDate } = body;

    // get records from google and generate data in format:
    const UsersData = [
      {
        id: '0102030405',
        report: 'REPORTE_METODO_MAIKA',
        email: 'deltorosalazar@gmail.com'
      },
      {
        id: '1870820221',
        report: 'REPORTE_METODO_MAIKA',
        email: 'chcamiloam@gmail.com'
      },
      {
        id: '0102030405',
        report: 'REPORTE_METODO_MAIKA',
        email: 'deltorosalazar+1@gmail.com'
      },
      {
        id: '1870820221',
        report: 'REPORTE_METODO_MAIKA',
        email: 'chcamiloam+1@gmail.com'
      },
      {
        id: '0102030405',
        report: 'REPORTE_METODO_MAIKA',
        email: 'deltorosalazar+2@gmail.com'
      },
      {
        id: '1870820221',
        report: 'REPORTE_METODO_MAIKA',
        email: 'chcamiloam+2@gmail.com'
      }, {
        id: '0102030405',
        report: 'REPORTE_METODO_MAIKA',
        email: 'deltorosalazar+3@gmail.com'
      },
      {
        id: '1870820221',
        report: 'REPORTE_METODO_MAIKA',
        email: 'chcamiloam+3@gmail.com'
      }
    ];

    // let result = await readFullSheet(FORMS['FORMULARIO_PACIENTE_SALUD_PHQ9'])

    // console.log(result)

    const sqsClient = createSqsClient();

    await Promise.all(UsersData.map(async (documentToCreate) => new Promise((resolve, reject) => {
      const params = {
        MessageBody: JSON.stringify(documentToCreate),
        QueueUrl: process.env.SQS_QUEUE_URL
      };

      sqsClient.sendMessage(params, (err, data) => {
        if (err) reject(err);
        else resolve(data);
      });
    })));

    // return res.status(200).json({
    //   text: 'test'
    // });

    return res.status(200).json({
      env: app.get('env'),
      UsersData
    });
  } catch (error) {
    console.log('Error', error);
    return res.status(error.httpStatusCode).json({
      timestamp: Date.now(),
      status: error.httpStatusCode,
      messages: [
        error.message
      ],
      data: error.data
    });
  }
});

app.post('/send-email', requiredParams(['id', 'report', 'email']), async (req, res) => {
  const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;

  // dev

  try {
    Logger.log('Step 1: Received request');
    const { id, report, email } = body;
    Logger.log('Step 2: Received params');
    const reportToGenerate = REPORTS[report];
    Logger.log('Step 3: Get Report');
    // For debugging purposes.

    if (!reportToGenerate) {
      throw new MaikaError(
        400,
        `Este reporte no existe [${report}].`,
        CLIENT_INVALID_OPTION,
        {
          received: report,
          expected: Object.keys(REPORTS)
        }
      );
    }
    Logger.log('Step 5: Start to generate base64');

    const { pdf, metadata } = await baseFunction(id, reportToGenerate, true);

    Logger.log('Step 6: base 64 generated, Send email');

    const result = await sendMail(pdf, email);

    Logger.log('Step 7: Email sent');

    Logger.log(result);

    return res.status(200).json({
      env: app.get('env'),
      metadata
    });
  } catch (error) {
    Logger.log('Step Fatal', error);
    return res.status(error.httpStatusCode || 400).json({
      timestamp: Date.now(),
      status: error.httpStatusCode,
      messages: [
        error.message
      ],
      data: error.data
    });
  }
});

const server = http.createServer(app);

server.listen(4000, '0.0.0.0', () => { return app.emit('app::started', 4000); });

module.exports = {
  server: app
};
