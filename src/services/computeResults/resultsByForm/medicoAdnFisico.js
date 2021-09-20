/**
 * @param {Object} report
 * @param {Object} results
 * @param {number} offsetIndexes
 * @returns {{
 *  recomendations: Array<string>
 * }}
 */
const computeResults = (report, formConfig, results) => {
  return {
    recomendations: results['Recomendaciones Fisico']
  };
};

module.exports = computeResults;
