const cocienteDeBienestarPercibidoEs = require('../../services/computeResults/resultsByComputedForm/cocienteDeBienestarPercibido');
const cocienteDeBienestarPercibidoEn = require('../../services/computeResults/resultsByComputedForm/cocienteDeBienestarPercibido__en');
const cocienteDeBienestarPonderadoConAdnEs = require('../../services/computeResults/resultsByComputedForm/cocienteDeBienestarPonderadoConAdn');
const cocienteDeBienestarPonderadoConAdnEn = require('../../services/computeResults/resultsByComputedForm/cocienteDeBienestarPonderadoConAdn__en');
const anexoMentalEs = require('../../services/computeResults/resultsByComputedForm/anexoMental');
const anexoMentalEn = require('../../services/computeResults/resultsByComputedForm/anexoMental__en');

const COMPUTED_FORMS = {
  ANEXO_MENTAL: {
    forms: 'ANEXO_MENTAL',
    function: {
      es: anexoMentalEs,
      en: anexoMentalEn
    }
  },
  COCIENTE_DE_BIENESTAR_PERCIBIDO: {
    forms: 'COCIENTE_DE_BIENESTAR_PERCIBIDO',
    function: {
      es: cocienteDeBienestarPercibidoEs,
      en: cocienteDeBienestarPercibidoEn
    }
  }, // Reporte Maika
  COCIENTE_DE_BIENESTAR_PONDERADO_CON_ADN: {
    forms: 'COCIENTE_DE_BIENESTAR_PONDERADO_CON_ADN',
    function: {
      es: cocienteDeBienestarPonderadoConAdnEs,
      en: cocienteDeBienestarPonderadoConAdnEn
    }
  } // Reporte Total con ADN
};

module.exports = {
  COMPUTED_FORMS
};
