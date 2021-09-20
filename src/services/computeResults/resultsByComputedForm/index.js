/* eslint-disable max-len */
const { COMPUTED_FORMS } = require('../../../shared/constants/forms');
const cocienteDeBienestarPonderadoConAdn = require('./cocienteDeBienestarPonderadoConAdn');
const anexoMental = require('./anexoMental');

const resultsByReport = {
  [COMPUTED_FORMS.COCIENTE_DE_BIENESTAR_PONDERADO_CON_ADN]: cocienteDeBienestarPonderadoConAdn,
  [COMPUTED_FORMS.ANEXO_MENTAL]: anexoMental
};

module.exports = resultsByReport;
