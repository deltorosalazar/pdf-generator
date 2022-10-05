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
  console.log('Paciente - PHQ9 (ES)');
  // const labels = Object.keys(results).filter((_, index) => {
  //   return index > offsetIndexes;
  // });

  // console.log({ labels });

  const labels = [
    'Poco interés o placer en hacer cosas',
    'Se ha sentido decaído(a), deprimido(a) o sin esperanzas',
    'Ha tenido dificultad para quedarse o permanecer dormido(a), o ha dormido demasiado',
    'Se ha sentido cansado(a) o con poca energía',
    'Sin apetito o ha comido en exceso',
    'Se ha sentido mal con usted mismo(a) - o que es un fracaso o que ha quedado mal con usted mismo(a) o con su familia',
    'Ha tenido dificultad para concentrarse en ciertas actividades, tales como leer el periódico o ver la TV',
    '¿ Se ha movido o hablado tan lento que otras personas podrían haberlo notado ? o lo contrario - muy inquieto(a) o agitado(a) que ha estado moviéndose mucho más de lo normal',
    'Pensamientos de que estaría mejor muerto(a) o de lastimarse de alguna manera',
    'Si marcó cualquiera de los problemas, ¿qué tanta dificultad le han dado estos problemas para hacer su trabajo, encargarse de las tareas del hogar, o llevarse bien con otras personas?'
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
