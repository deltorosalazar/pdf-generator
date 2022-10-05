/* eslint-disable max-len */
const Logger = require('../../../shared/Logger');
// const { FORMS, COMPUTED_FORMS } = require('../../../shared/constants');
const computeResultsByForm = require('../resultsByForm');
const computeResultsByComputedForm = require('../resultsByComputedForm');

const reporteMetodoMaika = (language, report, results) => {
  Logger.log(`📄 Reporte Método Maika - ${language}`);
  // Logger.log({
  //   forms: report.forms.map((form) => form.id),
  //   results
  // });

  report.forms.forEach((form) => {
    const formID = form.id[language];
  });

  console.log({ computeResultsByForm });

  const formsResults = report.forms.reduce((reportForms, form) => {
    const formID = form.id[language];

    return {
      ...reportForms,
      [formID]: computeResultsByForm[formID](report, form, results[formID])
    };
  }, {});

  const computedFormsByLanguage = computeResultsByComputedForm(language);
  const computedForms = report.computedForms.reduce((reportForms, computedForm) => {
    const formID = computedForm.id;

    const result = computedFormsByLanguage[formID](computedForm, formsResults, language);

    formsResults[formID] = result;

    return {
      ...reportForms,
      [formID]: result
    };
  }, {});

  return {
    ...formsResults,
    // ...computedForms
  };

  // reports = {
  //   ...reports,
  //   [FORMS.FORMULARIO_PACIENTE_SINTOMAS_MEDICOS]: {
  //     ...reports[FORMS.FORMULARIO_PACIENTE_SINTOMAS_MEDICOS],
  //     table: reports[FORMS.FORMULARIO_PACIENTE_SINTOMAS_MEDICOS].table.slice(0, 15),
  //     maxValues: reports[FORMS.FORMULARIO_PACIENTE_SINTOMAS_MEDICOS].maxValues.slice(0, 15),
  //     labels: reports[FORMS.FORMULARIO_PACIENTE_SINTOMAS_MEDICOS].labels.slice(0, 15)
  //   }
  // };

  // const cocienteDeBienestarPercibido = computeResultsByComputedForm[COMPUTED_FORMS.COCIENTE_DE_BIENESTAR_PERCIBIDO];
  // const resultsCocienteDeBienestarPercibido = cocienteDeBienestarPercibido(report.computedForms[COMPUTED_FORMS.COCIENTE_DE_BIENESTAR_PERCIBIDO], reports);

  // const anexoMental = computeResultsByComputedForm[COMPUTED_FORMS.ANEXO_MENTAL];
  // const resultsAnexoMental = anexoMental(report.computedForms[COMPUTED_FORMS.ANEXO_MENTAL], reports);

  // reports = {
  //   ...reports,
  //   [COMPUTED_FORMS.COCIENTE_DE_BIENESTAR_PERCIBIDO]: {
  //     ...resultsCocienteDeBienestarPercibido
  //   },
  //   [COMPUTED_FORMS.ANEXO_MENTAL]: {
  //     ...resultsAnexoMental
  //   }
  // };

  // return reports;
};

module.exports = reporteMetodoMaika;
