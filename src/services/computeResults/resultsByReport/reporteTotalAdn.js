/* eslint-disable max-len */
const Logger = require('../../../shared/Logger');
// const { COMPUTED_FORMS } = require('../../../shared/constants');
const computeResultsByForm = require('../resultsByForm');
const computeResultsByComputedForm = require('../resultsByComputedForm');

const reporteTotalAdn = (language, report, results) => {
  Logger.log('📄 Reporte Total ADN');
  // Logger.log({
  //   forms: report.forms.map((form) => form.id),
  //   results
  // });

  const formsResults = report.forms.reduce((reportForms, form) => {
    const formID = form.id[language];

    return {
      ...reportForms,
      [formID]: computeResultsByForm[formID](report, form, results[formID])
    };
  }, {});

  // Logger.log((formsResults));

  // return

  const computedFormsByLanguage = computeResultsByComputedForm(language);
  // Logger.log({ computedFormsByLanguage });

  const computedForms = report.computedForms.reduce((reportForms, computedForm) => {
    const formID = computedForm.id;

    const result = computedFormsByLanguage[formID](computedForm, formsResults, language);

    formsResults[formID] = result;

    return {
      ...reportForms,
      [formID]: result
    };
  }, {});

  // Logger.log({ computedForms });

  // const { COCIENTE_DE_BIENESTAR_PERCIBIDO } = COMPUTED_FORMS;

  // console.log('🅿️😀');
  // console.log({ report });

  // const cocienteDeBienestarPercibido = computeResultsByComputedForm[COCIENTE_DE_BIENESTAR_PERCIBIDO];
  // const resultsCocienteDeBienestarPercibido = cocienteDeBienestarPercibido(report.computedForms[COCIENTE_DE_BIENESTAR_PERCIBIDO], forms, language);

  // forms = {
  //   ...forms,
  //   [COMPUTED_FORMS.COCIENTE_DE_BIENESTAR_PERCIBIDO]: {
  //     ...resultsCocienteDeBienestarPercibido
  //   }
  // };

  // const cocienteDeBienestarPonderadoConAdn = computeResultsByComputedForm[COMPUTED_FORMS.COCIENTE_DE_BIENESTAR_PONDERADO_CON_ADN];
  // const resultsCocienteDeBienestarPonderadoConAdn = cocienteDeBienestarPonderadoConAdn(report.computedForms[COMPUTED_FORMS.COCIENTE_DE_BIENESTAR_PONDERADO_CON_ADN], forms);

  // forms = {
  //   ...forms,
  //   [COMPUTED_FORMS.COCIENTE_DE_BIENESTAR_PONDERADO_CON_ADN]: {
  //     ...resultsCocienteDeBienestarPonderadoConAdn
  //   }
  // };

  console.log({ formsResults: formsResults['COCIENTE_DE_BIENESTAR_PERCIBIDO']['table'] });

  return {
    ...formsResults,
    // ...computedForms
  };
};

module.exports = reporteTotalAdn;
