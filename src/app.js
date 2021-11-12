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
  readSheetsFromFirestore,
  readFullSheet
} = require('./services');

const {
  saveRecord,
  updateRecord
} = require('./helpers/faunadb')

const { REPORTS, FORMS } = require('./shared/constants');
const Logger = require('./shared/Logger');

const createSqsClient = require('./helpers/aws/sqs')
const sendMail = require('./helpers/aws/ses')

const requiredParams = require('./middlewares/params').handler;
const { CLIENT_INVALID_OPTION } = require('./shared/constants/error_codes');
const MaikaError = require('./shared/MaikaError');

const EMAIL_STATUS = {
  SENT: 'sent',
  QUEUE: 'queue'
}

const getMetadata = (report, results) => {
  const formsKeys = Object.keys(report.forms);
  const initialReport = results[formsKeys[0]];

  return {
    date: initialReport['Fecha'],
    patientName: initialReport['Nombre del Paciente']
  };
};

const baseFunction = async (patientID, reportToGenerate, generateBase64 = false, enhanced = false) => {
  try {
    const generateResultsMethod = enhanced ? readSheetsFromFirestore : readSheets
    const results = await generateResultsMethod(patientID, reportToGenerate);
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

    // Logger.log(JSON.stringify({ resultsWithCharts }, null, 2));

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

    const generateBase64 = false;
    const enhanced = body['enhanced']

    const { pdf } = await baseFunction(id, reportToGenerate, generateBase64, enhanced);

    pdf.pipe(res);

    // return res.writeHead(200, {
    //   'Content-Type': 'application/pdf',
    //   'Access-Control-Allow-Origin': '*',
    //   'Content-Disposition': `inline; filename=${computedResults.date}-${computedResults.patientName}.pdf`
    // });
  } catch (error) {
    console.log(error);
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

    const generateBase64 = true;
    const enhanced = body['enhanced']

    const { pdf, metadata } = await baseFunction(id, reportToGenerate, generateBase64, enhanced);

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

app.post('/bulk-emails', requiredParams(['startDate', 'endDate']), async (req, res) => {
  const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;

  try {

    const { startDate = "0/0/0", endDate = "0/0/0" } = body;

    let result = await readFullSheet(FORMS['FORMULARIO_PACIENTE_SALUD_PHQ9'])

    const d1 = startDate.split("/");
    const d2 = endDate.split("/");

    const dateFrom = new Date(d1[2], parseInt(d1[1]) - 1, d1[0]);
    const dateTo = new Date(d2[2], parseInt(d2[1]) - 1, d2[0]);

    const filteredRecords = result.rows.filter((row) => {
      const dateToCheck = row["Marca temporal"].split(' ')[0].split("/")
      const check = new Date(dateToCheck[2], parseInt(dateToCheck[1]) - 1, dateToCheck[0]);
      return check >= dateFrom && check <= dateTo
    }).map((row) => ({
      id: row['Documento de Identidad Paciente'],
      report: 'REPORTE_METODO_MAIKA',
      email: 'mdts.dev@gmail.com'
    }))

    //row['Dirección de correo electrónico']
    const sqsClient = createSqsClient()

    await Promise.all(filteredRecords.map(async (documentToCreate) => new Promise(async (resolve, reject) => {
      try {
        const params = {
          MessageBody: JSON.stringify(documentToCreate),
          QueueUrl: process.env.SQS_QUEUE_URL
        };

        await sqsClient.sendMessage(params).promise()
        await saveRecord({
          id: documentToCreate.id,
          email: documentToCreate.email,
          status: EMAIL_STATUS.QUEUE
        })
        resolve()
      } catch (error) {
        console.log('ERRORS')
        reject(error)
      }
    })))

    return res.status(200).json({
      env: app.get('env'),
      filteredRecords
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
})

app.post('/send-email', requiredParams(['id', 'report', 'email']), async (req, res) => {
  const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;

  try {
    const { id, report, email } = body;

    const reportToGenerate = REPORTS[report];

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

    const { pdf, metadata } = await baseFunction(id, reportToGenerate, true, true);

    await sendMail(pdf, email, id)

    await updateRecord(
      id, EMAIL_STATUS.SENT
    )

    return res.status(200).json({
      env: app.get('env'),
      metadata
    });

  } catch (error) {
    Logger.log('Step Fatal', error)
    return res.status(error.httpStatusCode || 400).json({
      timestamp: Date.now(),
      status: error.httpStatusCode,
      messages: [
        error.message
      ],
      data: error.data
    });
  }
})


const server = http.createServer(app);

server.listen(4000, '0.0.0.0', () => { return app.emit('app::started', 4000); });

module.exports = {
  server: app
};
