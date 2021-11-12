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
    'Se ha sentido nervioso(a), ansioso(a) o con los nervios de punta',
    'No ha sido capaz de parar o controlar su preocupación',
    'Se ha preocupado demasiado por motivos diferentes',
    'Ha tenido dificultad para relajarse',
    'Se ha sentido inquieto(a) que no ha podido quedarse quieto(a)',
    'Se ha molestado o irritado fácilmente',
    'Ha tenido miedo de que algo terrible fuera a pasar'
  ]

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
