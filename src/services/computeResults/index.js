const { REPORTS } = require('../../shared/constants')

const sumArrayValues = (array) => {
  if (!array.length) return 0;

  return array.reduce((prev, curr) => {
    return parseInt(prev) + parseInt(curr)
  }, 0)
}

const getArrayAverage = (array) => {
  return sumArrayValues(array) / array.length
}

/**
 *
 * @param {*} results
 * @param {*} reportToGenerate
 */
const computeResults = (results, reportToGenerate) => {
  return Promise.resolve(functionByReport[reportToGenerate.id](results, reportToGenerate))
}

const fisicoADN = (results, reportToGenerate) => {
  // TODO: Check how not to hardcode these values.
  const numericValues = results[0]
  const recomendations = results[1]

  // TODO: Check if this value is the same for all form results.
  const offsetIndexes = 4

  const labels = Object.keys(numericValues).filter((result, index) => {
    return index > offsetIndexes
  })

  const values = labels.map(label => parseInt(numericValues[label]))
  const maxValues = labels.map(_ => reportToGenerate.maxValue)
  const percentages = labels.map((_, index) => (parseInt(values[index]) / maxValues[index]).toFixed(2))
  const wellnessQuotient = sumArrayValues(values) / sumArrayValues(maxValues)

  console.log({labels, values, maxValues, percentages, wellnessQuotient});

  return {
    date: numericValues['Fecha'],
    labels,
    maxValues,
    patientName: recomendations['Nombre del Paciente'],
    percentages,
    recomendations: [
      recomendations['Recomendaciones Mente'] || recomendations['Recomendaciones Fisico']
    ],
    values,
    wellnessQuotient
  }
}

const medicamentos = (results, reportToGenerate) => {
  const numericValues = results[0]

  const offsetIndexes = 4

  const labels = Object.keys(numericValues).filter((result, index) => {
    return index > offsetIndexes
  })

  const values = labels.map(label => parseInt(numericValues[label]))
  const maxValues = labels.map(_ => reportToGenerate.maxValue)
  const percentages = labels.map((_, index) => (parseInt(values[index]) / maxValues[index]).toFixed(2))
  const wellnessQuotient = sumArrayValues(values) / sumArrayValues(maxValues)

  return {
    date: numericValues['Fecha'],
    labels,
    maxValues,
    recomendations: [
      ''
    ],
    patientName: numericValues['Nombre del Paciente'],
    percentages,
    values,
    wellnessQuotient
  }

}

const functionByReport = {
  [REPORTS.REPORTE_FISICO_ADN.id]: fisicoADN,
  [REPORTS.REPORTE_MEDS_ADN.id]: medicamentos,
  [REPORTS.REPORTE_MENTAL_ADN.id]: fisicoADN,
  [REPORTS.REPORTE_METODO_MAIKA.id]: null,
  [REPORTS.REPORTE_TOTAL_CON_ADN.id]: null
}

module.exports = computeResults
