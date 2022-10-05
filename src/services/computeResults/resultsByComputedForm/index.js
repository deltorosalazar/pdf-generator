/* eslint-disable max-len */
const { COMPUTED_FORMS } = require('../../../shared/constants');
// const cocienteDeBienestarPercibido = require('./cocienteDeBienestarPercibido');
// const cocienteDeBienestarPonderadoConAdn = require('./cocienteDeBienestarPonderadoConAdn');
// const anexoMental = require('./anexoMental');

const resultsByReport = (language) => {
  const functionByComputedForm = {};

  Object.keys(COMPUTED_FORMS).forEach((computedFormID) => {
    const functionKey = COMPUTED_FORMS[computedFormID]['function'];

    if (typeof functionKey === 'function') {
      functionByComputedForm[computedFormID] = functionKey;
    } else {
      functionByComputedForm[computedFormID] = functionKey[language];
    }
  });

  return functionByComputedForm;
};

// console.log({ results });

// const resultsByReport = {
//   [COMPUTED_FORMS.COCIENTE_DE_BIENESTAR_PERCIBIDO]: cocienteDeBienestarPercibido,
//   [COMPUTED_FORMS.COCIENTE_DE_BIENESTAR_PONDERADO_CON_ADN]: cocienteDeBienestarPonderadoConAdn,
//   [COMPUTED_FORMS.ANEXO_MENTAL]: anexoMental
// };

module.exports = resultsByReport;
