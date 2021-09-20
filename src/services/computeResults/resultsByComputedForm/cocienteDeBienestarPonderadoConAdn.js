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
const cocienteDeBienestarPonderadoConAdn = (formConfig, results) => {
  const sintomasPorSeccion = results[FORMS.FORMULARIO_PACIENTE_SINTOMAS_MEDICOS]['symptomsByChartSection'];
  const saludPhq9 = results[FORMS.FORMULARIO_PACIENTE_SALUD_PHQ9].values;
  const estresPercibido = results[FORMS.FORMULARIO_PACIENTE_ESTRES_PERCIBIDO].values;
  const transtornoAnsiedad = results[FORMS.FORMULARIO_PACIENTE_TRANSTORNO_DE_ANSIEDAD_GENERALIZADA].values;

  const labels = ['Nivel Energía', 'Salud Física', 'Estrés/Ansiedad', 'Capacidad Mental ', 'Propósito en Oficio', 'Depresión', 'Relacionamiento', 'Esparcimiento'];
  const topes = [20, 288, 21, 56, 32, 5, 27, 15, 10];
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

  const valoresFinales = percentages.map((valor) => {
    return valor * 5;
  });

  const wellnessQuotient = (ArrayUtils.sumValues(valoresFinales) / valoresFinales.length) * 5;

  const table = labels.map((label, index) => [label, percentages[index]]);

  return {
    date: results['Fecha'],
    labels,
    table,
    maxValues,
    patientName: results['Nombre del Paciente'],
    percentages,
    values: percentages,
    wellnessQuotient
  };
};

module.exports = cocienteDeBienestarPonderadoConAdn;
