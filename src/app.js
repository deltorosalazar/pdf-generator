require('dotenv').config()

const express = require('express')
const http = require('http')
const {urlencoded, json} = require('body-parser')
const helmet = require('helmet')
const cors = require('cors')
const morgan = require('morgan')
const app = express()
const generatePdf = require('./services/generatePDF')

const {
  computeResults,
  generateRadarChart,
  readSheets
} = require('./services')

const { REPORTS } = require('./shared/constants')

app
  .use(helmet())
  .use(cors())
  .use(urlencoded({extended: true}))
  .use(json())
  .use(morgan((tokens,req,res)=>[
    tokens.method(req, res),
    tokens.url(req, res),
    tokens.status(req, res),
    tokens.res(req, res, 'content-length'), '-',
    tokens['response-time'](req, res), 'ms'
  ].join(' ')))

app.get('/', function(req, res) {
  return res.status(200).json({
    env: app.get('env')
  })
})

app.post('/api/report', async function(req, res) {
  const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body

  const mandatoryParams = ['id', 'report']

  const areParamsComplete = mandatoryParams.reduce((prev, curr) => {
    return prev && Object.keys(body).includes(curr)
  }, true)

  if (!areParamsComplete) {
    return res.status(400).json({
      message: 'No se han enviado todos los parámetros necesarios.',
      data: {
        received: Object.keys(body),
        expected: mandatoryParams
      }
    })
  }

  const { id, report } = body

  const reportToGenerate = REPORTS[report]

  if (!reportToGenerate) {
    return res.status(400).json({
      message: 'Este reporte no existe.',
      data: {
        received: report,
        expected: Object.keys(REPORTS)
      }
    })
  }

  const results = await readSheets(id, reportToGenerate)

  // For debugging purposes.
  // console.log(results)
  // return

  const computedResults = await computeResults(results, reportToGenerate)

  const chart = await generateRadarChart(computedResults, reportToGenerate)
  let symptomsChart = null

  if (computedResults.symptoms) {
    const chartConfig = {
      axisLabelHeight: 80,
      axisLabelWidth: 235,
      axisLabelFontSize: 13
    }

    symptomsChart = await generateRadarChart(computedResults.symptoms, {chartConfig})
  }

  let result = await generatePdf(chart, reportToGenerate, computedResults, {
    symptomsChart: `data:image/jpg;base64,${symptomsChart}`,
    mentalChart: null
  })

  result.pipe(res)

  return res.writeHead(200, {
    'Content-Type': 'application/pdf',
    'Access-Control-Allow-Origin': '*',
    'Content-Disposition': `inline; filename=${computedResults.date}-${computedResults.patientName}.pdf`
  })
});

// Endpoint to return file in base64
app.post('/base', async function(req, res) {
  const { body } = req

  const mandatoryParams = ['id', 'report']

  const areParamsComplete = mandatoryParams.reduce((prev, curr) => {
    return prev && Object.keys(body).includes(curr)
  }, true)

  if (!areParamsComplete) {
    return res.status(400).json({
      message: 'No se han enviado todos los parámetros necesarios.',
      data: {
        received: Object.keys(body),
        expected: mandatoryParams
      }
    })
  }

  const { id, report } = body

  const reportToGenerate = REPORTS[report]

  if (!reportToGenerate) {
    return res.status(400).json({
      message: 'Este reporte no existe.',
      data: {
        received: report,
        expected: Object.keys(REPORTS)
      }
    })
  }

  const results = await readSheets(id, reportToGenerate)

  // For debugging purposes.
  // console.log(results)
  // return

  const computedResults = await computeResults(results, reportToGenerate)

  const chart = await generateRadarChart(computedResults, reportToGenerate)
  let images = []
  let result = await generatePdf(chart, images, reportToGenerate, computedResults)

  return res.status(200).json({
    message: 'ok',
    file: result.toString('base64')
  })
});

let server = http.createServer(app)

server.listen(4000, '0.0.0.0', () => app.emit('app::started', 4000))

module.exports = {
  server: app
}