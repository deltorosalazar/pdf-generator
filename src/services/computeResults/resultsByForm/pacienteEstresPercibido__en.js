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
 *  values: Array<number>
 *  wellnessQuotient: number
 * }}
 */
const computeResults = (report, formConfig, results, offsetIndexes = 4) => {
  // const labels = Object.keys(results).filter((_, index) => {
  //   return index > offsetIndexes;
  // });

  // console.log({ labels });

  const labels = [
    "In the last month, how often have you been upset because of something that happened unexpectedly?",
    "In the last month, how often have you felt that you were unable to control  important things in your life?",
    "In the last month, how often have you felt nervous and stressed?",
    "In the last month, how often have you dealt successfully with irritating life hassles?",
    "In the last month, how often have you felt that you were effectively coping with important changes that were occurring in your life?",
    "In the last month, how often have you felt confident about your ability to handle your personal problems?",
    "In the last month, how often have you felt that things were going your way?",
    "In the last month, how often have you found that you couldn't cope with all the things you had to do?",
    "In the last month, how often have you been able to control the irritations in your life?",
    "In the last month, how often have you felt that you were on top of things?",
    "In the last month, how often have you been angered because of things that happened that were outside of your control?",
    "In the last month, how often have you found yourself thinking  about things that you have to accomplish ?",
    "In the last month, how often have you been able to control the way you spend your time?",
    "In the last month, how often have you felt difficulties were piling up so high that you could not overcome them?"
  ];

  const values = labels.map((label) => parseInt(results[label]));
  const table = labels.map((label, index) => [label, values[index]]);
  const maxValues = labels.map((_) => formConfig.maxValue);
  const percentages = labels.map((_, index) => {
    return (parseInt(values[index]) / maxValues[index]).toFixed(2);
  });
  // eslint-disable-next-line max-len
  const wellnessQuotient = (ArrayUtils.sumValues(values) / ArrayUtils.sumValues(maxValues)).toFixed(2);

  return {
    date: results['Date'],
    labels,
    table,
    maxValues,
    patientName: results['Patient\'s Name'],
    percentages,
    values,
    wellnessQuotient
  };
};

module.exports = computeResults;
