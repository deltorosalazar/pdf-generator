/* eslint-disable max-len */
const { FORMS } = require('../../../shared/constants');

// const respuestaMedicamentos = require('./respuestaMedicamentos');
// const filtroAdnMente = require('./filtroAdnMente');
// const medicoAdnMente = require('./medicoAdnMente');
// const filtroAdnFisico = require('./filtroAdnFisico');
// const medicoAdnFisico = require('./medicoAdnFisico');
// const pacienteSintomas = require('./pacienteSintomas');
// const pacienteSaludPHQ9 = require('./pacienteSaludPHQ9');
// const pacienteEstresPercibido = require('./pacienteEstresPercibido');
// const pacienteTranstornoAnsiedadGeneralizada = require('./pacienteTranstornoAnsiedadGeneralizada');

// const results = {
// [FORMS.FORMULARIO_MEDICO_RESPUESTA_A_MEDICAMENTOS]: respuestaMedicamentos,
// [FORMS.FORMULARIO_MEDICO_FILTRO_ADN_MENTE]: filtroAdnMente,
// [FORMS.FORMULARIO_MEDICO_ADN_MENTE]: medicoAdnMente,
// [FORMS.FORMULARIO_MEDICO_FILTRO_ADN_FISICO]: filtroAdnFisico,
// [FORMS.FORMULARIO_MEDICO_ADN_FISICO]: medicoAdnFisico,
// [FORMS.FORMULARIO_PACIENTE_SINTOMAS_MEDICOS]: pacienteSintomas,
// [FORMS.FORMULARIO_PACIENTE_SALUD_PHQ9]: pacienteSaludPHQ9,
// [FORMS.FORMULARIO_PACIENTE_ESTRES_PERCIBIDO]: pacienteEstresPercibido,
// [FORMS.FORMULARIO_PACIENTE_TRANSTORNO_DE_ANSIEDAD_GENERALIZADA]: pacienteTranstornoAnsiedadGeneralizada
// };

const results = Object.keys(FORMS).reduce((accumulatedFormsID, currentFormKey) => {
  const formsPerLanguage = {};

  Object.keys(FORMS[currentFormKey]['forms']).forEach((languageForm) => {
    // if (typeof FORMS[currentFormKey]['function'] === 'object') {
    //   const languages = Object.keys(FORMS[currentFormKey]['function']);

    //   languages.forEach((language) => {
    //     formsPerLanguage[form] = FORMS[currentFormKey]['function'][language];
    //   });
    // } else {
    //   formsPerLanguage[form] = FORMS[currentFormKey]['function'];
    // }

    let functionPerLanguage = FORMS[currentFormKey]['function'];

    if (typeof FORMS[currentFormKey]['function'] === 'object') {
      functionPerLanguage = FORMS[currentFormKey]['function'][languageForm];
    }

    const formID = FORMS[currentFormKey]['forms'][languageForm];

    formsPerLanguage[formID] = functionPerLanguage;
  });

  return {
    ...accumulatedFormsID,
    ...formsPerLanguage
  };
}, {});

// console.log({ results });

module.exports = results;
