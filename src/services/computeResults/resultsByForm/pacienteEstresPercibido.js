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
    'En el último mes, ¿con qué frecuencia ha estado afectado por algo que ha ocurrido inesperadamente?',
    'En el último mes, ¿ con qué frecuencia se ha sentido incapaz de controlar las cosas importantes en su vida?',
    'En el último mes, ¿ con que frecuencia ha estado nervioso o estresado?',
    'En el último mes, ¿ con que frecuencia ha manejado con éxito los pequeños problemas irritantes de la vida?',
    'En el último mes, ¿ con que frecuencia ha sentido que ha afrontado efectivamente los cambios importantes que han estado ocurriendo en su vida?',
    'En el último mes, ¿ con que frecuencia ha estado seguro sobre su capacidad para manejar sus problemas personales?',
    'En el último mes, ¿ con que frecuencia ha sentido que las cosas le van bien?',
    'En el último mes, ¿ con que frecuencia ha sentido que no podía afrontar todas las cosas que tenía que hacer?',
    'En el último mes, ¿ con que frecuencia ha podido controlar las dificultades de su vida?',
    'En el último mes, ¿ con que frecuencia se ha sentido que tenía todo bajo control?',
    'En el último mes, ¿ con que frecuencia ha estado enfadado porque las cosas que le han ocurrido estaban fuera de su control?',
    'En el último mes, ¿ con que frecuencia ha pensado sobre las cosas que le quedan por hacer?',
    'En el último mes, ¿ con que frecuencia ha podido controlar la forma de pasar el tiempo?',
    'En el último mes, ¿ con que frecuencia ha sentido que las dificultades se acumulan tanto que no puede superarlas?'
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
