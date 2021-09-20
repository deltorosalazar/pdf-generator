/* eslint-disable max-len */
const { FORMS } = require('../../../shared/constants');

const respuestaMedicamentos = require('./respuestaMedicamentos');
const filtroAdnMente = require('./filtroAdnMente');
const medicoAdnMente = require('./medicoAdnMente');
const filtroAdnFisico = require('./filtroAdnFisico');
const medicoAdnFisico = require('./medicoAdnFisico');
const pacienteSintomas = require('./pacienteSintomas');
const pacienteSaludPHQ9 = require('./pacienteSaludPHQ9');
const pacienteEstresPercibido = require('./pacienteEstresPercibido');
const pacienteTranstornoAnsiedadGeneralizada = require('./pacienteTranstornoAnsiedadGeneralizada');

const results = {
  [FORMS.FORMULARIO_MEDICO_RESPUESTA_A_MEDICAMENTOS]: respuestaMedicamentos,
  [FORMS.FORMULARIO_MEDICO_FILTRO_ADN_MENTE]: filtroAdnMente,
  [FORMS.FORMULARIO_MEDICO_ADN_MENTE]: medicoAdnMente,
  [FORMS.FORMULARIO_MEDICO_FILTRO_ADN_FISICO]: filtroAdnFisico,
  [FORMS.FORMULARIO_MEDICO_ADN_FISICO]: medicoAdnFisico,
  [FORMS.FORMULARIO_PACIENTE_SINTOMAS_MEDICOS]: pacienteSintomas,
  [FORMS.FORMULARIO_PACIENTE_SALUD_PHQ9]: pacienteSaludPHQ9,
  [FORMS.FORMULARIO_PACIENTE_ESTRES_PERCIBIDO]: pacienteEstresPercibido,
  [FORMS.FORMULARIO_PACIENTE_TRANSTORNO_DE_ANSIEDAD_GENERALIZADA]: pacienteTranstornoAnsiedadGeneralizada
};

module.exports = results;
