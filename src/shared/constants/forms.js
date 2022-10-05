const {
  FORMULARIO_MEDICO_FILTRO_ADN_FISICO__ES,
  FORMULARIO_MEDICO_FILTRO_ADN_FISICO__EN,
  FORMULARIO_MEDICO_FILTRO_ADN_MENTE__ES,
  FORMULARIO_MEDICO_FILTRO_ADN_MENTE__EN,
  FORMULARIO_PACIENTE_SALUD_PHQ9__ES,
  FORMULARIO_PACIENTE_SALUD_PHQ9__EN,
  FORMULARIO_PACIENTE_ESTRES_PERCIBIDO__ES,
  FORMULARIO_PACIENTE_ESTRES_PERCIBIDO__EN,
  FORMULARIO_PACIENTE_SINTOMAS_MEDICOS__ES,
  FORMULARIO_PACIENTE_SINTOMAS_MEDICOS__EN,
  FORMULARIO_PACIENTE_TRANSTORNO_DE_ANSIEDAD_GENERALIZADA__ES,
  FORMULARIO_PACIENTE_TRANSTORNO_DE_ANSIEDAD_GENERALIZADA__EN,
  FORMULARIO_MEDICO_RESPUESTA_A_MEDICAMENTOS__ES,
  FORMULARIO_MEDICO_RESPUESTA_A_MEDICAMENTOS__EN,


  FORMULARIO_MEDICO_TOTAL_MENTE,
  FORMULARIO_MEDICO_TOTAL_FISICO,
  FORMULARIO_MEDICO_1_MENTE,
  FORMULARIO_MEDICO_1_FISICO,
  FORMULARIO_MEDICO_ADN_MENTE,
  FORMULARIO_MEDICO_ADN_FISICO,
} = process.env;

const filtroAdnFisico = require('../../services/computeResults/resultsByForm/filtroAdnFisico');
const filtroAdnMente = require('../../services/computeResults/resultsByForm/filtroAdnMente');
const pacienteSaludPHQ9 = require('../../services/computeResults/resultsByForm/pacienteSaludPHQ9');
const pacienteSaludPHQ9En = require('../../services/computeResults/resultsByForm/pacienteSaludPHQ9__en');
const pacienteEstresPercibido = require('../../services/computeResults/resultsByForm/pacienteEstresPercibido');
const pacienteEstresPercibidoEn = require('../../services/computeResults/resultsByForm/pacienteEstresPercibido__en');
const pacienteSintomas = require('../../services/computeResults/resultsByForm/pacienteSintomas');
const pacienteSintomasEn = require('../../services/computeResults/resultsByForm/pacienteSintomas__en');
const pacienteTranstornoAnsiedadGeneralizada = require('../../services/computeResults/resultsByForm/pacienteTranstornoAnsiedadGeneralizada');
const pacienteTranstornoAnsiedadGeneralizadaEn = require('../../services/computeResults/resultsByForm/pacienteTranstornoAnsiedadGeneralizada__en');
const respuestaAMedicamentos = require('../../services/computeResults/resultsByForm/respuestaMedicamentos');
const respuestaAMedicamentosEn = require('../../services/computeResults/resultsByForm/respuestaMedicamentos');

const FORMS = {
  FORMULARIO_MEDICO_FILTRO_ADN_FISICO: {
    forms: {
      es: FORMULARIO_MEDICO_FILTRO_ADN_FISICO__ES,
      en: FORMULARIO_MEDICO_FILTRO_ADN_FISICO__EN
    },
    function: filtroAdnFisico
  },
  FORMULARIO_MEDICO_FILTRO_ADN_MENTE: {
    forms: {
      es: FORMULARIO_MEDICO_FILTRO_ADN_MENTE__ES,
      en: FORMULARIO_MEDICO_FILTRO_ADN_MENTE__EN
    },
    function: filtroAdnMente
  },
  FORMULARIO_PACIENTE_SALUD_PHQ9: {
    forms: {
      es: FORMULARIO_PACIENTE_SALUD_PHQ9__ES,
      en: FORMULARIO_PACIENTE_SALUD_PHQ9__EN
    },
    function: {
      es: pacienteSaludPHQ9,
      en: pacienteSaludPHQ9En
    }
  },
  FORMULARIO_PACIENTE_ESTRES_PERCIBIDO: {
    forms: {
      es: FORMULARIO_PACIENTE_ESTRES_PERCIBIDO__ES,
      en: FORMULARIO_PACIENTE_ESTRES_PERCIBIDO__EN
    },
    function: {
      es: pacienteEstresPercibido,
      en: pacienteEstresPercibidoEn
    }
  },
  FORMULARIO_PACIENTE_SINTOMAS_MEDICOS: {
    forms: {
      es: FORMULARIO_PACIENTE_SINTOMAS_MEDICOS__ES,
      en: FORMULARIO_PACIENTE_SINTOMAS_MEDICOS__EN
    },
    function: {
      es: pacienteSintomas,
      en: pacienteSintomasEn
    }
  },
  FORMULARIO_PACIENTE_TRANSTORNO_DE_ANSIEDAD_GENERALIZADA: {
    forms: {
      es: FORMULARIO_PACIENTE_TRANSTORNO_DE_ANSIEDAD_GENERALIZADA__ES,
      en: FORMULARIO_PACIENTE_TRANSTORNO_DE_ANSIEDAD_GENERALIZADA__EN
    },
    function: {
      es: pacienteTranstornoAnsiedadGeneralizada,
      en: pacienteTranstornoAnsiedadGeneralizadaEn
    }
  },
  FORMULARIO_MEDICO_RESPUESTA_A_MEDICAMENTOS: {
    forms: {
      es: FORMULARIO_MEDICO_RESPUESTA_A_MEDICAMENTOS__ES,
      en: FORMULARIO_MEDICO_RESPUESTA_A_MEDICAMENTOS__EN
    },
    function: {
      es: respuestaAMedicamentos,
      en: respuestaAMedicamentosEn
    }
  }
  // FORMULARIO_MEDICO_ADN_MENTE,
  // FORMULARIO_MEDICO_ADN_FISICO,
};

console.log(FORMS['FORMULARIO_MEDICO_RESPUESTA_A_MEDICAMENTOS']);

module.exports = {
  FORMS
};
