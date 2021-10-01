/* eslint-disable max-len */
const { COMPUTED_FORMS } = require('../../../shared/constants');
const computeResultsByForm = require('../resultsByForm');
const computeResultsByComputedForm = require('../resultsByComputedForm');

const reporteTotalAdn = (report, results) => {
  let reports = Object.keys(report.forms).reduce((reportForms, currentFormID) => {
    return {
      ...reportForms,
      [currentFormID]: computeResultsByForm[currentFormID](report, report.forms[currentFormID], results[currentFormID])
    };
  }, {});

  const cocienteDeBienestarPercibido = computeResultsByComputedForm[COMPUTED_FORMS.COCIENTE_DE_BIENESTAR_PERCIBIDO];
  const resultsCocienteDeBienestarPercibido = cocienteDeBienestarPercibido(report.computedForms[COMPUTED_FORMS.COCIENTE_DE_BIENESTAR_PERCIBIDO], reports);

  reports = {
    ...reports,
    [COMPUTED_FORMS.COCIENTE_DE_BIENESTAR_PERCIBIDO]: {
      ...resultsCocienteDeBienestarPercibido
    }
  };

  const cocienteDeBienestarPonderadoConAdn = computeResultsByComputedForm[COMPUTED_FORMS.COCIENTE_DE_BIENESTAR_PONDERADO_CON_ADN];
  const resultsCocienteDeBienestarPonderadoConAdn = cocienteDeBienestarPonderadoConAdn(report.computedForms[COMPUTED_FORMS.COCIENTE_DE_BIENESTAR_PONDERADO_CON_ADN], reports);

  reports = {
    ...reports,
    [COMPUTED_FORMS.COCIENTE_DE_BIENESTAR_PONDERADO_CON_ADN]: {
      ...resultsCocienteDeBienestarPonderadoConAdn
    }
  };

  return reports;
};

module.exports = reporteTotalAdn;
