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
  console.log('Paciente - PHQ9 (EN)');
  // const labels = Object.keys(results).filter((_, index) => {
  //   return index > offsetIndexes;
  // });

  // console.log({ labels });

  const labels = [
    'Little interest or pleasure in doing things',
    'Feeling down, depressed, or hopeless',
    'Trouble falling or staying asleep, or sleeping too much',
    'Feeling tired or having little energy',
    'Poor appetite or overeating',
    'Feeling bad about yourself or that you are a failure or have let yourself or your family down',
    'Trouble concentrating on things, such as reading the newspaper or watching television',
    'Moving or speaking so slowly than other people could have noticed? Or the opposite - being so fidgety or restless that you have been moving around a lot more than usual',
    'Thoughts that you would be better off dead or of hurting yourself in some way',
    'How difficult have those problems made it for you to do your work, take care of things at home, or get along with other people?',
  ];

  labels.map((label) => {
    console.log(`${label} -> ${results[label]}`);
  })

  const values = labels.map((label) => parseInt(results[label]));
  const table = labels.map((label, index) => [label, values[index]]);
  const maxValues = labels.map((_) => formConfig.maxValue);
  const percentages = labels.map((_, index) => {
    return (parseInt(values[index]) / maxValues[index]).toFixed(2);
  });
  // eslint-disable-next-line max-len
  const wellnessQuotient = (ArrayUtils.sumValues(values) / ArrayUtils.sumValues(maxValues)).toFixed(2);

  return {
    date: results['Fecha'],
    labels,
    table,
    maxValues,
    patientName: results['Nombre del Paciente'],
    percentages,
    values,
    wellnessQuotient
  };
};

module.exports = computeResults;
