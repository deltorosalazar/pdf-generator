const { CHARTS } = require('../../shared/constants');
const generateRadarChart = require('./radar');

const generateChart = (chartTypeID, results, config) => {
  switch (chartTypeID) {
    case CHARTS.RADAR:
      return generateRadarChart(results, config);

    default:
      return null;
  }
};

module.exports = generateChart;
