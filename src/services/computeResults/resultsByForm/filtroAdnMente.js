const { ArrayUtils } = require('../../../shared/utils');

/**
 * @param {Object} report
 * @param {Object} results
 * @param {number} offsetIndexes
 * @returns {{
 *  date: string
 *  labels: Array<string>
 *  maxValues: Array<number>
 *  patientName: string
 *  percentages: Array<string>
 *  table: Array<Array<string, number>>
 *  values: Array<number>
 *  wellnessQuotient: number
 * }}
 */
const computeResults = (report, formConfig, results, offsetIndexes = 4) => {
  const labels = Object.keys(results).filter((_, index) => {
    return index > offsetIndexes;
  });

  const values = labels.map((label) => parseInt(results[label]));
  const table = labels.map((label, index) => [label, values[index]]);
  const maxValues = labels.map((_) => formConfig.maxValue);
  const percentages = labels.map((_, index) => {
    return (parseInt(values[index]) / maxValues[index]).toFixed(2);
  });
  // eslint-disable-next-line max-len
  const wellnessQuotient = (
    ArrayUtils.sumValues(values, false) / ArrayUtils.sumValues(maxValues)
  ).toFixed(2);

  return {
    date: results['Fecha'],
    labels,
    maxValues,
    patientName: results['Nombre del Paciente'],
    percentages,
    table,
    values,
    wellnessQuotient,
    tableBounds: formConfig.tableBounds
  };
};

module.exports = computeResults;
