const fs = require('fs')
const JSDOM = require('jsdom').JSDOM
const jsdom = new JSDOM(`
  <body>
    <div id="container"></div>
  </body>
`, { runScripts: 'dangerously' })

const window = jsdom.window
const anychart = require('anychart')(window)
const anychartExport = require('anychart-nodejs')(anychart)

/**
 *
 * @param {*} computedResults
 * @param {*} reportToGenerate
 */
const generateRadarChart = async (computedResults, reportToGenerate) => {
  const { labels, maxValues, values } = computedResults

  const dataset = anychart.data.set(
    labels.map((label, index) => {
      return [
        label,
        parseFloat(maxValues[index]),
        parseFloat(values[index])
      ]
    })
  )

  console.log(labels.map((label, index) => {
    return [
      label,
      parseFloat(maxValues[index]),
      parseFloat(values[index])
    ]
  }));

  const data1 = dataset.mapAs({ x: 0, value: 1 })
  const data2 = dataset.mapAs({ x: 0, value: 2 })

  const chart = anychart.radar()

  chart.bounds(0, 0, 800, 600)
  chart.title(reportToGenerate.chartTitle || '')
  chart.yScale().minimum(0).maximum(reportToGenerate.maxValue + 1).ticks({ interval: 1 })

  chart.xAxis().labels().width(reportToGenerate.chartConfig.axisLabelWidth)
  chart.xAxis().labels().height(reportToGenerate.chartConfig.axisLabelHeight)
  chart.xAxis().labels().fontSize(reportToGenerate.chartConfig.axisLabelFontSize)
  chart.xAxis().labels().fontColor('#125393')
  chart.xAxis().labels().fontWeight('bold')
  chart.xAxis().labels().vAlign('middle')
  chart.xAxis().labels().hAlign(reportToGenerate.chartConfig.hAlign)


  chart.line(data1).name('Base').markers({size: 5, fill: '#004400', type: 'circle', zIndex: 40})
  chart.line(data1).stroke({color: '#008000', thickness: 5, lineCap: 'round'})
  chart.line(data2).name('Paciente').markers({size: 5, fill: '#47001d', type: 'circle', zIndex: 40})
  chart.line(data2).stroke({color: '#800033', thickness: 5, lineCap: 'round'})
  chart.container('container');
  chart.draw();

  const image = await anychartExport.exportTo(chart, 'jpg')

  let buff = Buffer.from(image)
  let base64data = buff.toString('base64')

  // For debugging purposes.
  // fs.writeFile(`${Date.now()}.jpg`, image, function (fsWriteError) {
  //   if (fsWriteError) {
  //     console.log(fsWriteError);
  //   } else {
  //     console.log('Complete');
  //   }
  // });

  return Promise.resolve(base64data)
}

module.exports = generateRadarChart