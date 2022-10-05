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
} = require('./helpers/faunadb');

const { REPORTS, FORMS, EMAIL_STATUS } = require('./shared/constants');
const Logger = require('./shared/Logger');

const createSqsClient = require('./helpers/aws/sqs');
const sendMail = require('./helpers/aws/ses');

const requiredParams = require('./middlewares/params').handler;
const { CLIENT_INVALID_OPTION } = require('./shared/constants/error_codes');
const MaikaError = require('./shared/MaikaError');
const { FirestoreService } = require('./services/FirestoreService');

const getMetadata = (language, results) => {
  const primaryKeyPerLanguage = {
    patientName: {
      en: "Patient's Name",
      es: 'Nombre del Paciente'
    },
    date: {
      en: 'Date',
      es: 'Fecha'
    }
  };

  const initialResults = Object.values(results)[0];

  return {
    date: initialResults[primaryKeyPerLanguage['date'][language]],
    patientName: initialResults[primaryKeyPerLanguage['patientName'][language]]
  };
};

// eslint-disable-next-line max-len
const baseFunction = async (language, patientID, reportToGenerate, generateBase64 = false, enhanced = false) => {
  try {
    let results = null;

    if (enhanced) {
      results = await readSheetsFromFirestore(patientID, reportToGenerate);
    } else {
      results = await readSheets(language, patientID, reportToGenerate);
    }

    if (results.stopProcess) {
      return { pdf: null, metadata: null, stopProcess: true };
    }

    let metadata = {};

    // For debugging purposes.
    // Logger.log('🆗 Results retrieved from Google Spreadsheets successfuly.');
    Logger.log(JSON.stringify({ results }, null, 2));

    if (results instanceof Error) throw new Error(results);

    let computedResults = null;

    computedResults = await computeResults(language, reportToGenerate, results);



    metadata = {
      ...getMetadata(language, results),
      id: patientID,
      report: reportToGenerate.id
    };

    // For debugging purposes.
    // Logger.log(JSON.stringify({ computedResults }, null, 2));

    const reportForms = [...reportToGenerate.forms, ...reportToGenerate.computedForms];

    const resultsCharts = await Promise.all(
      reportForms.map((form) => {
        let formID = form['id'];

        if (typeof form['id'] === 'object') {
          formID = form['id'][language];
        }

        if (form.chartConfig) {
          const { type } = form.chartConfig;

          return generateChart(type, computedResults[formID], form.chartConfig);
        }

        return undefined;
        // const form = reportToGenerate.forms[formID] ? reportToGenerate.forms[formID] : reportToGenerate.computedForms[formID];

        // return form.chartConfig ? generateChart(form.chartConfig.type, computedResults[formID], form.chartConfig) : Promise.resolve(undefined);
      })
    );

    Logger.log('🆗 Charts generated successfuly.');

    const resultsWithCharts = Object.keys(computedResults).reduce((accumulatedResults, formID, index) => {
      // const content = resultsCharts[index];
      // if (content) {
      //   console.log(content);
      //   fs.writeFile(`${formID}.txt`, content, (err) => {
      //     if (err) {
      //       console.error(err);
      //     }
      //     // file written successfully
      //   });
      // }

      return {
        ...accumulatedResults,
        [formID]: {
          ...accumulatedResults[formID],
          chart: resultsCharts[index],
          ...metadata
        }
      };
    }, computedResults);

    Logger.log('🆗 Results with charts generated successfuly.');

    const pdf = await generatePdf(language, reportToGenerate, resultsWithCharts, generateBase64);

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
  const language = body.language || 'es';

  try {
    const { id: patientID, report } = body;
    const reportToGenerate = REPORTS[report];

    // For debugging purposes.
    // Logger.log({ reportToGenerate });

    if (!reportToGenerate) {
      throw new MaikaError(
        400,
        `El reporte ${report} no existe.`,
        CLIENT_INVALID_OPTION,
        {
          received: report,
          expected: Object.keys(REPORTS)
        }
      );
    }

    const generateBase64 = false;
    const { enhanced } = body;

    const { pdf } = await baseFunction(
      language, patientID, reportToGenerate, generateBase64, enhanced
    );

    pdf.pipe(res);

    // return res.writeHead(200, {
    //   'Content-Type': 'application/pdf',
    //   'Access-Control-Allow-Origin': '*',
    //   'Content-Disposition': `inline; filename=${computedResults.date}-${computedResults.patientName}.pdf`
    // });
  } catch (error) {
    console.log({ error });
    return res.status(error.httpStatusCode || 500).json({
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
  const language = body.language || 'es';

  try {
    const { id: patientID, report } = body;
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
    const { enhanced } = body;

    const { pdf, metadata, stopProcess } = await baseFunction(
      language, patientID, reportToGenerate, generateBase64, enhanced
    );

    if (pdf === null && stopProcess && enhanced) {
      return res.status(200).json({
        message: 'Missing information to generate report'
      });
    }

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
  const language = body.language || 'es';

  try {
    const { startDate = '0/0/0', endDate = '0/0/0', isProduction = false } = body;

    const result = await readFullSheet(FORMS['FORMULARIO_PACIENTE_SALUD_PHQ9']);

    const d1 = startDate.split('/');
    const d2 = endDate.split('/');

    const dateFrom = new Date(d1[2], parseInt(d1[1]) - 1, d1[0]);
    const dateTo = new Date(d2[2], parseInt(d2[1]) - 1, d2[0]);

    const uniqueIDKey = language === 'es'
      ? 'Documento de Identidad Paciente'
      : "Patient's Cellphone";

    const emailIDKey = language === 'es'
      ? 'Dirección de correo electrónico'
      : "Patient's Email";

    const firestoreService = new FirestoreService();
    // const bulkID = Date.now();

    // firestoreService.create('bulk-email-reports-ids', bulkID, {
    //   name: bulkID
    // });

    const filteredRecords = result.rows.filter((row) => {
      const dateToCheck = row['Marca temporal'].split(' ')[0].split('/');
      const check = new Date(dateToCheck[2], parseInt(dateToCheck[1]) - 1, dateToCheck[0]);

      return check >= dateFrom && check <= dateTo;
    }).map((row) => (
      {
        id: row[uniqueIDKey],
        report: 'REPORTE_METODO_MAIKA',
        email: isProduction ? row[emailIDKey] : 'mdts.dev@gmail.com',
        language
        // bulkID
      }));

    const sqsClient = createSqsClient();

    await Promise.all(filteredRecords.map(async (documentToCreate) => new Promise(async (resolve, reject) => {
      try {
        const params = {
          MessageBody: JSON.stringify(documentToCreate),
          QueueUrl: process.env.SQS_QUEUE_URL
        };

        await sqsClient.sendMessage(params).promise();
        await saveRecord({
          id: documentToCreate.id,
          email: documentToCreate.email,
          status: EMAIL_STATUS.QUEUE
        });

        firestoreService.create('bulk-email-reports', `${documentToCreate.id}`, {
          id: documentToCreate.id,
          email: documentToCreate.email,
          status: EMAIL_STATUS.QUEUE
          // bulkID
        });

        resolve();
      } catch (error) {
        console.log('ERRORS', error);
        reject(error);
      }
    })));

    return res.status(200).json({
      env: app.get('env'),
      sent: filteredRecords.length,
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
});

app.post('/send-email', requiredParams(['id', 'report', 'email']), async (req, res) => {
  const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;

  try {
    const {
      id: patientID, report, email, language
    } = body;
    const reportToGenerate = REPORTS[report];

    const firestoreService = new FirestoreService();

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

    const { pdf, metadata, stopProcess } = await baseFunction(
      language, patientID, reportToGenerate, true, true
    );

    if (pdf === null && stopProcess) {
      return res.status(200).json({
        message: 'Missing information to generate report'
      });
    }

    await sendMail(pdf, email, patientID, language);

    await updateRecord(
      patientID, EMAIL_STATUS.SENT
    );

    await firestoreService.updateOne('bulk-email-reports', patientID, {
      status: EMAIL_STATUS.SENT
    });

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
