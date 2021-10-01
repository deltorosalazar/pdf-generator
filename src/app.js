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
const generateBase = require('./services/generatePDF/generateBase');
const {
  computeResults,
  generateChart,
  generateRadarChart,
  readSheets
} = require('./services');

const { REPORTS } = require('./shared/constants');
const Logger = require('./shared/Logger');

const requiredParams = require('./middlewares/params').handler;
const { CLIENT_INVALID_OPTION } = require('./shared/constants/error_codes');
const MaikaError = require('./shared/MaikaError');

const baseFunction = (generateBase64 = false) => {

}

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

    const results = await readSheets(id, reportToGenerate);

    // For debugging purposes.
    // Logger.log(JSON.stringify({ results }, null, 2));

    // if (results instanceof Error) throw new Error(results);

    let computedResults = null;

    try {
      computedResults = await computeResults(reportToGenerate, results);
    } catch (error) {
      console.log({ error });
      return res.status(500).json({
        method: 'computeResults'
      });
    }

    // For debugging purposes.
    // Logger.log(JSON.stringify({ computedResults }, null, 2));

    const { computedForms, forms } = reportToGenerate;
    const formsKeys = [...Object.keys(forms), ...Object.keys(computedForms || {})];

    const resultsCharts = await Promise.all(
      formsKeys
        // .filter((formID) => reportToGenerate.forms[formID].chartConfig)
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

    const result = await generatePdf(reportToGenerate, resultsWithCharts);

    result.pipe(res);

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

  const { id, report } = body;

  const reportToGenerate = REPORTS[report];

  if (!reportToGenerate) {
    return res.status(400).json({
      timestamp: Date.now(),
      status: 400,
      message: 'Este reporte no existe.',
      data: {
        received: report,
        expected: Object.keys(REPORTS)
      }
    });
  }

  try {
    const results = await readSheets(id, reportToGenerate);

    let computedResults = null;

    computedResults = await computeResults(results, reportToGenerate);

    const chart = await generateRadarChart(computedResults, reportToGenerate);

    let symptomsChart = null;
    let anexoMentalChart = null;

    if (computedResults.symptoms) {
      const chartConfig = {
        axisLabelHeight: 80,
        axisLabelWidth: 235,
        axisLabelFontSize: 13
      };

      symptomsChart = await generateRadarChart(computedResults.symptoms, {
        chartConfig
      });
    }

    if (computedResults.anexoMental) {
      const chartConfig = {
        axisLabelHeight: 50,
        axisLabelWidth: 115,
        axisLabelFontSize: 12
      };

      anexoMentalChart = await generateRadarChart(computedResults.anexoMental, {
        chartConfig
      });
    }

    try {
      const result = await generateBase(chart, reportToGenerate, computedResults, {
        symptomsChart: `data:image/jpg;base64,${symptomsChart}`,
        mentalChart: `data:image/jpg;base64,${anexoMentalChart}`
      });

      return res.status(200).json({
        message: 'ok',
        file: result,
        metadata: {
          date: computedResults.date,
          id,
          report,
          patientName: computedResults.patientName
        }
      });
    } catch (error) {
      console.log('Error');
    }
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

const server = http.createServer(app);

server.listen(4000, '0.0.0.0', () => { return app.emit('app::started', 4000); });

module.exports = {
  server: app
};
