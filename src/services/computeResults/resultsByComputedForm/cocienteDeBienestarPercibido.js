/* eslint-disable max-len */
const { FORMS } = require('../../../shared/constants/forms');
const { ArrayUtils } = require('../../../shared/utils');
const Logger = require('../../../shared/Logger');

/**
 * @param {Object} formConfig
 * @param {Object} results
 * @param {string} language
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
const cocienteDeBienestarPercibido = (formConfig, results, language) => {
  Logger.log('📄 Cociente de Bienestar Percibido');

  const sintomasPorSeccion = results[FORMS.FORMULARIO_PACIENTE_SINTOMAS_MEDICOS['forms'][language]]['symptomsByChartSection'];
  const saludPhq9 = results[FORMS.FORMULARIO_PACIENTE_SALUD_PHQ9['forms'][language]].values;
  const estresPercibido = results[FORMS.FORMULARIO_PACIENTE_ESTRES_PERCIBIDO['forms'][language]].values;
  const transtornoAnsiedad = results[FORMS.FORMULARIO_PACIENTE_TRANSTORNO_DE_ANSIEDAD_GENERALIZADA['forms'][language]].values;

  console.log({ language });
  // console.log(results[FORMS.FORMULARIO_PACIENTE_SINTOMAS_MEDICOS['forms'][language]]);

  // console.log({
  //   sintomasPorSeccion,
  //   saludPhq9,
  //   estresPercibido,
  //   transtornoAnsiedad
  // });

  const labels = ['Nivel Energía', 'Salud Física', 'Estrés/Ansiedad', 'Capacidad Mental ', 'Propósito en Oficio', 'Depresión', 'Relacionamiento', 'Esparcimiento'];
  const topes = [20, 288, 21, 56, 32, 5, 27, 15, 10];
  const sumasPorCuestionario = [
    ArrayUtils.sumValues(sintomasPorSeccion[2]),
    ArrayUtils.sumValues(Array.from(Array(16), (_) => '').map((_, index) => ArrayUtils.sumValues(sintomasPorSeccion[index]))),
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

  const porcentajeRealSobreTope = sumasPorCuestionario.map((valorSuma, index) => {
    return (valorSuma / topes[index]);
  });

  const maxValues = labels.map((_) => formConfig.maxValue);

  const percentages = [
    (1 - porcentajeRealSobreTope[0]).toFixed(2),
    (1 - porcentajeRealSobreTope[1]).toFixed(2),
    (0.5 * (1 - porcentajeRealSobreTope[2]) + 0.5 * (1 - porcentajeRealSobreTope[3])).toFixed(2),
    (1 - porcentajeRealSobreTope[4]).toFixed(2),
    (Math.abs(porcentajeRealSobreTope[5])).toFixed(2),
    (1 - porcentajeRealSobreTope[6]).toFixed(2),
    (Math.abs(porcentajeRealSobreTope[7])).toFixed(2),
    (Math.abs(porcentajeRealSobreTope[8])).toFixed(2)
  ];

  const wellnessQuotient = ArrayUtils.sumValues(percentages.map((value) => value * 5), false) / (percentages.length * 5);

  const table = labels.map((label, index) => [label, (percentages[index] * 100).toFixed(2)]);

  return {
    date: results['Fecha'],
    labels,
    table,
    maxValues,
    patientName: results['Nombre del Paciente'],
    percentages: percentages.map((value) => value * 5),
    values: percentages.map((value) => value * 100),
    wellnessQuotient: wellnessQuotient * 100,
    tableBounds: formConfig.tableBounds
  };
};

module.exports = cocienteDeBienestarPercibido;
