const { REPORTS } = require('../../shared/constants')

const sumArrayValues = (array, convertToInt = true) => {
  if (!array.length) return 0;

  const fn = convertToInt ? parseInt : parseFloat

  return array.reduce((prev, curr) => {
    return fn(prev) + fn(curr)
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

  // console.log({labels, values, maxValues, percentages, wellnessQuotient});

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

const reporteMaika = (results) => {
  const getValues = (results, offsetIndexes) => {
    return Object.keys(results)
      .filter((_, index) => index > offsetIndexes)
      .map((resultKey) => results[resultKey])
  }

  const offsetIndexes = 4

  const recomendacionesAdnMente = getValues(results[0], offsetIndexes)
  const recomendacionesAdnFisico = getValues(results[1], offsetIndexes)
  const sintomas = results[2]
  const saludPhq9 = getValues(results[3], offsetIndexes)
  const estresPercibido = getValues(results[4], offsetIndexes)
  const transtornoAnsiedad = getValues(results[5], offsetIndexes)

  const symptomsLabels = [
    'Cabeza',
    'Cabeza',
    'Corazón',
    'Energía / Actividad',
    'Ojos',
    'Pulmones',
    'Mente',
    'Oídos',
    'Tracto Digestivo',
    'Salud Emomcional',
    'Nariz',
    'Músculos / Articulaciones',
    'Garganta / Boca',
    'Peso / Nutrición',
    'Derma',
    'Otros Físicos',
    'Otros Relacionamiento',
    'Otros Espacios de Esparcimiento/Hobbies',
    'Otros Propósito en tu oficio',
  ]

  const sintomasPorSeccion = [
    [],
    [
      sintomas['Dolor de Cabeza'],
      sintomas['Debilidad'],
      sintomas['Mareo'],
      sintomas['Insomnio']
    ],
    [
      sintomas['Latidos Irregulares'],
      sintomas['Palpitaciones'],
      sintomas['Dolor en el Pecho']
    ],
    [
      sintomas['Fatiga'],
      sintomas['Apatía'],
      sintomas['Hiperactividad'],
      sintomas['Síndrome de Pierna Inquieta'],
      sintomas['Descompensación Horaria']
    ],
    [
      sintomas['Ojos llorosos o con picazón'],
      sintomas['Párpados hinchados / enrojecidos'],
      sintomas['Bolsas / Ojeras'],
      sintomas['Visión borrosa o de túnel']
    ],
    [
      sintomas['Congestión en el Pecho'],
      sintomas['Asma / Bronquitis'],
      sintomas['Dificultad para Respirar']
    ],
    [
      sintomas['Dificultades de memoria'],
      sintomas['Confusión / Bajo nivel de comprensión'],
      sintomas['Dificultad para concentrarse'],
      sintomas['Problemas de coordinación física'],
      sintomas['Dificultad para tomar decisiones'],
      sintomas['Tartamudeo'],
      sintomas['Habla arrastrada'],
      sintomas['Dificultades de Aprendizaje']
    ],
    [
      sintomas['Picazón en los oídos'],
      sintomas['Dolor de Oído / Infecciones'],
      sintomas['Drenaje en oídos / Fluídos'],
      sintomas['Pérdida de Audición']
    ],
    [
      sintomas['Vómito / Nausea'],
      sintomas['Diarrea'],
      sintomas['Estreñimiento'],
      sintomas['Sensación de Hinchazón'],
      sintomas['Eructos / Gases'],
      sintomas['Acidez Estomacal'],
      sintomas['Dolor Intestinal / Estomacal']
    ],
    [
      sintomas['Cambios de Humor'],
      sintomas['Ansiedad / Miedos / Nerviosismo'],
      sintomas['Enfado / Agresividad / Irritabilidad'],
      sintomas['Depresión']
    ],
    [
      sintomas['Congestión Nasal'],
      sintomas['Problemas de los senos nasales'],
      sintomas['Rinitis Alérgica'],
      sintomas['Ataques de Estornudos'],
      sintomas['Mucosidad Excesiva']
    ],
    [
      sintomas['Dolor en Articulaciones'],
      sintomas['Artrítis'],
      sintomas['Rigidez / Limitación de Movimiento'],
      sintomas['Dolor Muscular'],
      sintomas['Debilidad y Cansancio']
    ],
    [
      sintomas['Tos Crónica'],
      sintomas['Arcadas / Carraspeo'],
      sintomas['Dolor de Garganta / Ronquera'],
      sintomas['Inflamación / Decoloración de lengua-encías-labios'],
      sintomas['Aftas']
    ],
    [
      sintomas['Impulso excesivo en la comida'],
      sintomas['Ansia ciertos alimentos'],
      sintomas['Exceso de peso'],
      sintomas['Alimentación Compulsiva'],
      sintomas['Retención de Agua'],
      sintomas['Bajo Peso']
    ],
    [
      sintomas['Acne'],
      sintomas['Urticaria / Erupciones / Piel Seca'],
      sintomas['Perdida de Cabello'],
      sintomas['Enrojecimiento / Sofoco'],
      sintomas['Sudor Excesivo']
    ],
    [
      sintomas['Enfermedad Frecuente'],
      sintomas['Micción frecuente y urgente'],
      sintomas['Picazón Genital'],
      sintomas['Dolor en los Huesos']
    ],
    [
      sintomas['Cómo evalúas tu relacionamiento con tus familiares?'],
      sintomas['Como evalúas tu relacionamiento con tu pareja?'],
      sintomas['Cómo evalúas tu relacionamiento con tus amigos y/o colegas de trabajo?']
    ],
    [
      sintomas['Cómo evalúas tus espacios de esparcimiento?'],
      sintomas['Cómo evalúas tu conexión con otros en espacios diferentes al del trabajo o familiar?'],
    ],
    [
      sintomas['Que tan satisfactoria es tu conexión con tu tipo de trabajo u oficio?']
    ]
  ]

  const labels = ['Nivel Energía', 'Salud Física', 'Estrés/Ansiedad', 'Capacidad Mental ', 'Propósito en Oficio', 'Depresión', 'Relacionamiento', 'Esparcimiento']

  const topes = [20, 288, 21, 56, 32, 5, 27, 15, 10]
  const sumasPorCuestionario = [
    sumArrayValues(sintomasPorSeccion[3]),
    sumArrayValues(Array.from(Array(16), (_, __) => '').map((_, index) => sumArrayValues(sintomasPorSeccion[index]))),
    sumArrayValues(transtornoAnsiedad),
    (estresPercibido.reduce((prev, curr, index) => {
      if ([3, 4, 5, 6, 8, 9, 12].includes(index)) {
        return prev + (4 - curr)
      }

      return parseInt(prev) + parseInt(curr)
    }, 0)),
    sumArrayValues(sintomasPorSeccion[6]),
    sumArrayValues(sintomasPorSeccion[18]),
    sumArrayValues(saludPhq9),
    sumArrayValues(sintomasPorSeccion[16]),
    sumArrayValues(sintomasPorSeccion[17]),
  ]

  const porcentajeRealSobreTope = sumasPorCuestionario.map((valorSuma, index) => {
    return (valorSuma / topes[index]).toFixed(2)
  })

  const percentages = [
    (1 - porcentajeRealSobreTope[0]),
    (1 - porcentajeRealSobreTope[1]),
    (.5 * (1 - porcentajeRealSobreTope[2]) + .5 * (1 - porcentajeRealSobreTope[3])).toFixed(2),
    (1 - porcentajeRealSobreTope[4]),
    (Math.abs(porcentajeRealSobreTope[5])),
    (1 - porcentajeRealSobreTope[6]),
    (Math.abs(porcentajeRealSobreTope[7])),
    (Math.abs(porcentajeRealSobreTope[8])),
  ]

  const valoresFinales = percentages.map((valor) => {
    return valor * 5
  })

  const wellnessQuotient = sumArrayValues(valoresFinales) / valoresFinales.length * 5

  return {
    date: sintomas['Fecha'],
    labels,
    values: valoresFinales,
    maxValues: Array.from(Array(labels.length), (_, __) => 6),
    patientName: sintomas['Nombre del Paciente'],
    recomendations: [
      recomendacionesAdnMente,
      recomendacionesAdnFisico
    ],
    wellnessQuotient,
    percentages: percentages,
    symptoms: {
      values: sintomasPorSeccion.slice(1).map(symptoms => getArrayAverage(symptoms)),
      maxValues: sintomasPorSeccion.slice(1).map(_ => 5),
      labels: symptomsLabels.slice(1)
    },
    anexoMental: {
      values: [
        100 - (sumasPorCuestionario[3] / 56) * 100,
        100 - (sumasPorCuestionario[2] / 21) * 100,
        100 - (sumasPorCuestionario[6] / 27) * 100
      ],
      maxValues: sintomasPorSeccion.slice(1).map(_ => 100),
      labels: [
        'Estrés', 'Ansiedad', 'Depresión'
      ]
    }
  }
}

const reporte360 = (results, reportToGenerate) => {
  // RESULTADOS REPORTE MAIKA
  const resultadosReporteMaika = reporteMaika(results)
  const ponderacionReporteMaika = resultadosReporteMaika.percentages
  const reporteMaikaIndexes = {
    nivelEnergiaIndex: resultadosReporteMaika.labels.indexOf('Nivel Energía'),
    saludFisicaIndex: resultadosReporteMaika.labels.indexOf('Salud Física'),
    estresAnsiedadIndex: resultadosReporteMaika.labels.indexOf('Estrés/Ansiedad'),
    capacidadMentalIndex: resultadosReporteMaika.labels.indexOf('Capacidad Mental '), /// ESTA TIENE UN ESPACIO,
    propositoOficioIndex: resultadosReporteMaika.labels.indexOf('Propósito en Oficio'),
    depresionIndex: resultadosReporteMaika.labels.indexOf('Depresión'),
    relacionamientoIndex: resultadosReporteMaika.labels.indexOf('Relacionamiento'),
    esparcimientoIndex: resultadosReporteMaika.labels.indexOf('Esparcimiento')
  }
  const valoresReporteMaika = {
    nivelEnergia: resultadosReporteMaika.values[reporteMaikaIndexes.nivelEnergiaIndex],
    saludFisica: resultadosReporteMaika.values[reporteMaikaIndexes.saludFisicaIndex],
    estresAnsiedad: resultadosReporteMaika.values[reporteMaikaIndexes.estresAnsiedadIndex],
    capacidadMental: resultadosReporteMaika.values[reporteMaikaIndexes.capacidadMentalIndex],
    propositoOficio: resultadosReporteMaika.values[reporteMaikaIndexes.propositoOficioIndex],
    depresion: resultadosReporteMaika.values[reporteMaikaIndexes.depresionIndex],
    relacionamiento: resultadosReporteMaika.values[reporteMaikaIndexes.relacionamientoIndex],
    esparcimiento: resultadosReporteMaika.values[reporteMaikaIndexes.esparcimientoIndex]
  }

  const sintomasIndexes = {
    propositoOficioIndex: resultadosReporteMaika.symptoms.labels.indexOf('Otros Propósito en tu oficio'),
    esparcimientoIndex: resultadosReporteMaika.symptoms.labels.indexOf('Otros Espacios de Esparcimiento/Hobbies')
  }

  const valoresSintomas = {
    propositoOficio: resultadosReporteMaika.symptoms.values[sintomasIndexes.propositoOficioIndex],
    esparcimiento: resultadosReporteMaika.symptoms.values[sintomasIndexes.esparcimientoIndex]
  }

  // console.log({
    // sintomasIndexes,
    // labels: resultadosReporteMaika.symptoms.labels,
    // labels: resultadosReporteMaika.symptoms.values,
    // valoresSintomas
  // })

  // RESULTADOS FISICO ADN
  const resultadosFisicoAdn = fisicoADN([results[6], results[0]], REPORTS.REPORTE_FISICO_ADN)
  const resultadosFisicoAdnIndexes = {
    fatigaIndex: resultadosFisicoAdn.labels.indexOf('Fatiga'),
  }
  const valoresFisicoAdn = {
    nivelEnergia: resultadosFisicoAdn.values[resultadosFisicoAdnIndexes.fatigaIndex],
    saludFisica: resultadosFisicoAdn.wellnessQuotient * 5,
  }

  // RESULTADOS MENTE ADN
  const resultadosMenteAdn = fisicoADN([results[7], results[1]], REPORTS.REPORTE_MENTAL_ADN)
  const resultadosMenteAdnIndexes = {
    estresAnsiedadIndex: resultadosMenteAdn.labels.indexOf('Estrés & Ansiedad'),
    habilidadCognitivaIndex: resultadosMenteAdn.labels.indexOf('Habilidad Cognitiva'),
    depresionIndex: resultadosMenteAdn.labels.indexOf('Depresión'),
    relacionamientoIndex: resultadosMenteAdn.labels.indexOf('Relacionamiento'),
  }
  const valoresMenteAdn = {
    estresAnsiedad: resultadosMenteAdn.values[resultadosMenteAdnIndexes.estresAnsiedadIndex],
    capacidadMental: resultadosMenteAdn.values[resultadosMenteAdnIndexes.habilidadCognitivaIndex],
    depresion: resultadosMenteAdn.values[resultadosMenteAdnIndexes.depresionIndex],
    relacionamiento: resultadosMenteAdn.values[resultadosMenteAdnIndexes.relacionamientoIndex],
  }

  const labels = ['Nivel Energía', 'Salud Física', 'Estrés/Ansiedad', 'Capacidad Mental ', 'Propósito en Oficio', 'Depresión', 'Relacionamiento', 'Esparcimiento']

  const values = [
    (valoresReporteMaika.nivelEnergia * .5) + (valoresFisicoAdn.nivelEnergia * .5),
    (valoresReporteMaika.saludFisica * .5) + (valoresFisicoAdn.saludFisica * .5),
    (valoresReporteMaika.estresAnsiedad * .5) + (valoresMenteAdn.estresAnsiedad * .5),
    (valoresReporteMaika.capacidadMental * .5) + (valoresMenteAdn.capacidadMental * .5),
    (valoresReporteMaika.propositoOficio * .5) + (valoresSintomas.propositoOficio * .5),
    (valoresReporteMaika.depresion * .5) + (valoresMenteAdn.depresion * .5),
    (valoresReporteMaika.relacionamiento * .5) + (valoresMenteAdn.relacionamiento * .5),
    (valoresReporteMaika.esparcimiento * .5) + (valoresSintomas.esparcimiento * .5),
  ]

  const percentages = [
    (values[0] / 5).toFixed(2),
    (values[1] / 5).toFixed(2),
    (values[2] / 5).toFixed(2),
    (values[3] / 5).toFixed(2),
    (values[4] / 5).toFixed(2),
    (values[5] / 5).toFixed(2),
    (values[6] / 5).toFixed(2),
    (values[7] / 5).toFixed(2),
  ]

  const wellnessQuotient = parseInt(sumArrayValues(values, false) / (values.length * 5))

  // console.log({
  //   length: values.length,
  //   values,
  //   sum: sumArrayValues(values, false),
  //   totalValues: (values.length * 5),
  //   wq: sumArrayValues(values, false) / (values.length * 5)
  // });

  // console.log({
    // resultadosReporteMaika,
    // valoresReporteMaika,
    // valoresFisicoAdn,
    // valoresMenteAdn,
    // percentages,
    // valoresReporteMaika: valoresReporteMaika.saludFisica,
    // valoresFisicoAdn: valoresFisicoAdn.saludFisica
    // resultadosReporteMaika,
    // resultadosFisicoAdn
  // });

  return {
    date: resultadosFisicoAdn['date'],
    labels,
    values,
    maxValues: Array.from(Array(labels.length), (_, __) => 6),
    patientName: resultadosFisicoAdn['patientName'],
    recomendations: [
      resultadosMenteAdn.recomendations[0],
      resultadosFisicoAdn.recomendations[0],
    ],
    wellnessQuotient,
    percentages
  }
}

const functionByReport = {
  [REPORTS.REPORTE_FISICO_ADN.id]: fisicoADN,
  [REPORTS.REPORTE_MEDS_ADN.id]: medicamentos,
  [REPORTS.REPORTE_MENTAL_ADN.id]: fisicoADN,
  [REPORTS.REPORTE_METODO_MAIKA.id]: reporteMaika,
  [REPORTS.REPORTE_TOTAL_CON_ADN.id]: reporte360
}

module.exports = computeResults
