/* eslint-disable max-len */
const { FORMS } = require('../../../shared/constants/forms');
// const { COMPUTED_FORMS } = require('../../../shared/constants/computedForms');
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
const cocienteDeBienestarPonderadoConAdn = (formConfig, results, language) => {
  const cocienteDeBienestarPercibido = results['COCIENTE_DE_BIENESTAR_PERCIBIDO'];
  const reporteMaikaIndexes = {
    nivelEnergiaIndex: cocienteDeBienestarPercibido.labels.indexOf('Energy Level'),
    saludFisicaIndex: cocienteDeBienestarPercibido.labels.indexOf('Physical Average'),
    estresAnsiedadIndex: cocienteDeBienestarPercibido.labels.indexOf('Stress & Anxiety'),
    capacidadMentalIndex: cocienteDeBienestarPercibido.labels.indexOf('Cognitive Ability'),
    propositoOficioIndex: cocienteDeBienestarPercibido.labels.indexOf('Purpose'),
    depresionIndex: cocienteDeBienestarPercibido.labels.indexOf('Depression'),
    relacionamientoIndex: cocienteDeBienestarPercibido.labels.indexOf('Relationships'),
    esparcimientoIndex: cocienteDeBienestarPercibido.labels.indexOf('Recreation')
  };

  const valoresReporteMaika = {
    nivelEnergia: cocienteDeBienestarPercibido.percentages[reporteMaikaIndexes.nivelEnergiaIndex],
    saludFisica: cocienteDeBienestarPercibido.percentages[reporteMaikaIndexes.saludFisicaIndex],
    estresAnsiedad: cocienteDeBienestarPercibido.percentages[reporteMaikaIndexes.estresAnsiedadIndex],
    capacidadMental: cocienteDeBienestarPercibido.percentages[reporteMaikaIndexes.capacidadMentalIndex],
    propositoOficio: cocienteDeBienestarPercibido.percentages[reporteMaikaIndexes.propositoOficioIndex],
    depresion: cocienteDeBienestarPercibido.percentages[reporteMaikaIndexes.depresionIndex],
    relacionamiento: cocienteDeBienestarPercibido.percentages[reporteMaikaIndexes.relacionamientoIndex],
    esparcimiento: cocienteDeBienestarPercibido.percentages[reporteMaikaIndexes.esparcimientoIndex]
  };



  // RESULTADOS FISICO ADN
  const resultadosFisicoAdn = results[FORMS.FORMULARIO_MEDICO_FILTRO_ADN_FISICO['forms'][language]];
  const resultadosFisicoAdnIndexes = {
    fatigaIndex: resultadosFisicoAdn.labels.indexOf('Fatigue Risk')
  };
  const valoresFisicoAdn = {
    nivelEnergia: resultadosFisicoAdn.values[resultadosFisicoAdnIndexes.fatigaIndex],
    saludFisica: resultadosFisicoAdn.wellnessQuotient * 5
  };



  // RESULTADOS MENTE ADN
  const resultadosMenteAdn = results[FORMS.FORMULARIO_MEDICO_FILTRO_ADN_MENTE['forms'][language]];

  const resultadosMenteAdnIndexes = {
    estresAnsiedadIndex: resultadosMenteAdn.labels.indexOf('Stress & Anxiety Risk'),
    habilidadCognitivaIndex: resultadosMenteAdn.labels.indexOf('Low Cognitive Function Risk'),
    depresionIndex: resultadosMenteAdn.labels.indexOf('Depression Risk'),
    relacionamientoIndex: resultadosMenteAdn.labels.indexOf('Low ability to build relationships Risk'),
    recreacionIndex: resultadosMenteAdn.labels.indexOf('Low Openness to Experiences Risk')
  };

  const valoresMenteAdn = {
    estresAnsiedad: resultadosMenteAdn.values[resultadosMenteAdnIndexes.estresAnsiedadIndex],
    capacidadMental: resultadosMenteAdn.values[resultadosMenteAdnIndexes.habilidadCognitivaIndex],
    depresion: resultadosMenteAdn.values[resultadosMenteAdnIndexes.depresionIndex],
    relacionamiento: resultadosMenteAdn.values[resultadosMenteAdnIndexes.relacionamientoIndex],
    recreacion: resultadosMenteAdn.values[resultadosMenteAdnIndexes.recreacionIndex]
  };

  const labels = ['Energy Level', 'Physical Average', 'Stress & Anxiety', 'Cognitive Ability', 'Purpose', 'Depression', 'Relationships', 'Recreation'];
  const values = [
    ((valoresReporteMaika.nivelEnergia * 0.5) + (valoresFisicoAdn.nivelEnergia * 0.5)).toFixed(2),
    ((valoresReporteMaika.saludFisica * 0.5) + (valoresFisicoAdn.saludFisica * 0.5)).toFixed(2),
    ((valoresReporteMaika.estresAnsiedad * 0.5) + (valoresMenteAdn.estresAnsiedad * 0.5)).toFixed(2),
    ((valoresReporteMaika.capacidadMental * 0.5) + (valoresMenteAdn.capacidadMental * 0.5)).toFixed(2),
    ((valoresReporteMaika.propositoOficio * 0.5) + (valoresMenteAdn.recreacion * 0.5)).toFixed(2),
    ((valoresReporteMaika.depresion * 0.5) + (valoresMenteAdn.depresion * 0.5)).toFixed(2),
    ((valoresReporteMaika.relacionamiento * 0.5) + (valoresMenteAdn.relacionamiento * 0.5)).toFixed(2),
    ((valoresReporteMaika.esparcimiento * 0.5) + (valoresMenteAdn.recreacion * 0.5)).toFixed(2)
  ];

  // console.log('💰💰💰💰💰💰💰💰');
  // console.log([
  //   valoresFisicoAdn.nivelEnergia * 0.5,
  //   valoresFisicoAdn.saludFisica * 0.5,
  //   valoresMenteAdn.estresAnsiedad * 0.5,
  //   valoresMenteAdn.capacidadMental * 0.5,
  //   valoresReporteMaika.propositoOficio * 0.5,
  //   valoresMenteAdn.depresion * 0.5,
  //   valoresMenteAdn.relacionamiento * 0.5,
  //   valoresMenteAdn.recreacion * 0.5
  // ]);

  // console.log('💰💰💰💰💰💰💰💰');
  // console.log([
  //   valoresReporteMaika.nivelEnergia * 0.5,
  //   valoresReporteMaika.saludFisica * 0.5,
  //   valoresReporteMaika.estresAnsiedad * 0.5,
  //   valoresReporteMaika.capacidadMental * 0.5,
  //   valoresReporteMaika.propositoOficio * 0.5,
  //   valoresReporteMaika.depresion * 0.5,
  //   valoresReporteMaika.relacionamiento * 0.5,
  //   valoresReporteMaika.esparcimiento * 0.5
  // ]);
  const wellnessQuotient = parseFloat(ArrayUtils.sumValues(values, false) / (values.length * 5));

  const percentages = values.map((value) => ((value / 5) * 100));

  const table = labels.map((label, index) => [label, Math.round(percentages[index])]);
  const maxValues = labels.map((_) => formConfig.maxValue);

  return {
    date: results['Fecha'],
    labels,
    table,
    maxValues,
    patientName: results['Nombre del Paciente'],
    percentages,
    values,
    wellnessQuotient: (wellnessQuotient * 100).toFixed(2),
    tableBounds: formConfig.tableBounds
  };
};

module.exports = cocienteDeBienestarPonderadoConAdn;
