/* eslint-disable max-len */
const fs = require('fs');
const { JSDOM } = require('jsdom');

const jsdom = new JSDOM(`
  <body>
    <div id="container"></div>
  </body>
`, { runScripts: 'dangerously' });

const { window } = jsdom;
const anychart = require('anychart')(window);
const anychartExport = require('anychart-nodejs')(anychart);

/**
 *
 * @param {*} computedResults
 * @param {*} reportToGenerate
 * @param {*} base64
 */
const generateRadarChart = async (results, chartConfig, base64 = true) => {
  const { labels, maxValues, values } = results;

  const dataset = anychart.data.set(
    labels.map((label, index) => {
      return [
        label,
        parseFloat(maxValues[index]),
        parseFloat(values[index])
      ];
    })
  );

  const referenceData = dataset.mapAs({ x: 0, value: 1 });
  const data = dataset.mapAs({ x: 0, value: 2 });

  const chart = anychart.radar();

  chart.bounds(
    chartConfig.bounds.x || 0,
    chartConfig.bounds.y || 0,
    chartConfig.bounds.width,
    chartConfig.bounds.heigth
  );
  chart.padding(0).margin(0);
  chart.title(chartConfig.title || '');
  chart.yScale()
    .minimum(chartConfig.yScale.min || 0)
    .maximum(chartConfig.yScale.max).ticks({
      interval: chartConfig.yScale.interval || 0
    });

  if (chartConfig.xAxis) {
    chartConfig.xAxis.label.width && chart.xAxis().labels().width(chartConfig.xAxis.label.width);
    chartConfig.xAxis.label.height && chart.xAxis().labels().height(chartConfig.xAxis.label.height);
    chartConfig.xAxis.label.fontSize && chart.xAxis().labels().fontSize(chartConfig.xAxis.label.fontSize);
    chartConfig.xAxis.label.hAlign && chart.xAxis().labels().hAlign(chartConfig.xAxis.label.hAlign);
    chartConfig.xAxis.label.vAlign && chart.xAxis().labels().vAlign(chartConfig.xAxis.label.vAlign || 'middle');
  }

  chart.xAxis().labels()
    .fontColor('#7b52fb')
    .fontFamily('Avenir')
    .fontWeight('bold');

  chart.line(referenceData).name('Reference').markers({
    size: 5, fill: '#f74e01', type: 'circle', zIndex: 40
  });
  chart.line(referenceData).stroke({
    color: '#f47136', thickness: 5, lineCap: 'round'
  });

  chart.area(data).name('Paciente').markers({
    size: 5, fill: '#6739f6', type: 'circle', zIndex: 40
  });
  chart.area(data).stroke({ color: '#7b52fb', thickness: 5, lineCap: 'round' });
  chart.yGrid(true);
  chart.yGrid().stroke('black');
  chart.xGrid(true);
  chart.xGrid().stroke('black');

  chart.container('container');
  chart.draw();

  const image = await anychartExport.exportTo(chart, 'jpg');

  if (base64) {
    const buff = Buffer.from(image);
    const base64data = buff.toString('base64');

    return Promise.resolve(base64data);
  }
};

module.exports = generateRadarChart;
