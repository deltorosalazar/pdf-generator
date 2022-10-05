const computeResultsByReport = require('./resultsByReport');

/**
 *
 * @param {string} language
 * @param {Object} report
 * @param {*} results
 */
const computeResults = (language, report, results) => {
  console.log({ language, report, results });
  const reportFunction = computeResultsByReport[report.id];

  if (!reportFunction) {
    return Promise.resolve({});
  }

  return Promise.resolve(reportFunction(language, report, results));
};

module.exports = computeResults;
