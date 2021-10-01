const computeResultsByReport = require('./resultsByReport');

/**
 *
 * @param {Object} report
 * @param {*} results
 */
const computeResults = (report, results) => {
  const reportFunction = computeResultsByReport[report.id];

  if (!reportFunction) {
    return Promise.resolve({});
  }

  return Promise.resolve(reportFunction(report, results));
};

module.exports = computeResults;
