/* eslint-disable max-len */
const { FORMS } = require('../../../shared/constants/forms');
const { ArrayUtils } = require('../../../shared/utils');

/**
 * @param {Object} results
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
const anexoMental = (formConfig, results, language) => {
  console.log('Anexo Mental - ES');

  const sintomasPorSeccion = results[FORMS.FORMULARIO_PACIENTE_SINTOMAS_MEDICOS['forms'][language]]['symptomsByChartSection'];
  const saludPhq9 = results[FORMS.FORMULARIO_PACIENTE_SALUD_PHQ9['forms'][language]].values;
  const estresPercibido = results[FORMS.FORMULARIO_PACIENTE_ESTRES_PERCIBIDO['forms'][language]].values;
  const transtornoAnsiedad = results[FORMS.FORMULARIO_PACIENTE_TRANSTORNO_DE_ANSIEDAD_GENERALIZADA['forms'][language]].values;

  const labels = ['Estrés', 'Ansiedad', 'Depresión'];
  const sumasPorCuestionario = [
    ArrayUtils.sumValues(sintomasPorSeccion[2]),
    ArrayUtils.sumValues(Array.from(Array(16), (_, __) => '').map((_, index) => ArrayUtils.sumValues(sintomasPorSeccion[index]))),
    ArrayUtils.sumValues(transtornoAnsiedad),
    (estresPercibido.reduce((prev, curr, index) => {
      if ([3, 4, 5, 6, 8, 9, 12].includes(index)) {
        return prev + (4 - curr);
      }

      return parseInt(prev) + parseInt(curr);
    }, 0)),
    ArrayUtils.sumValues(sintomasPorSeccion[5]),
    ArrayUtils.sumValues(sintomasPorSeccion[17]),
    ArrayUtils.sumValues(saludPhq9),
    ArrayUtils.sumValues(sintomasPorSeccion[15]),
    ArrayUtils.sumValues(sintomasPorSeccion[16])
  ];

  const values = [
    Math.round(100 - (sumasPorCuestionario[3] / 56) * 100),
    Math.round(100 - (sumasPorCuestionario[2] / 21) * 100),
    Math.round(100 - (sumasPorCuestionario[6] / 27) * 100)
  ];

  const table = labels.map((label, index) => [label, values[index]]);

  const maxValues = values.slice(1).map((_) => formConfig.maxValue);

  return {
    date: results['Fecha'],
    labels,
    table,
    maxValues,
    patientName: results['Nombre del Paciente'],
    percentages: values,
    values,
    tableBounds: formConfig.tableBounds
  };
};

module.exports = anexoMental;
