const { CHARTS } = require('../../shared/constants');
const generateRadarChart = require('./radar');

const generateChart = (chartID, results, config) => {
  switch (chartID) {
    case CHARTS.RADAR:
      return generateRadarChart(results, config);

    default:
      return null;
  }
};

module.exports = generateChart;
