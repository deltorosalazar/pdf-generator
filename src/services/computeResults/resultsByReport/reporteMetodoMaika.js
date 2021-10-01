/* eslint-disable max-len */
const { FORMS, COMPUTED_FORMS } = require('../../../shared/constants');
const computeResultsByForm = require('../resultsByForm');
const computeResultsByComputedForm = require('../resultsByComputedForm');

const reporteMetodoMaika = (report, results) => {
  let reports = Object.keys(report.forms).reduce((reportForms, currentFormID) => {
    return {
      ...reportForms,
      [currentFormID]: computeResultsByForm[currentFormID](report, report.forms[currentFormID], results[currentFormID])
    };
  }, {});

  reports = {
    ...reports,
    [FORMS.FORMULARIO_PACIENTE_SINTOMAS_MEDICOS]: {
      ...reports[FORMS.FORMULARIO_PACIENTE_SINTOMAS_MEDICOS],
      table: reports[FORMS.FORMULARIO_PACIENTE_SINTOMAS_MEDICOS].table.slice(0, 15),
      maxValues: reports[FORMS.FORMULARIO_PACIENTE_SINTOMAS_MEDICOS].maxValues.slice(0, 15),
      labels: reports[FORMS.FORMULARIO_PACIENTE_SINTOMAS_MEDICOS].labels.slice(0, 15)
    }
  };

  const cocienteDeBienestarPercibido = computeResultsByComputedForm[COMPUTED_FORMS.COCIENTE_DE_BIENESTAR_PERCIBIDO];
  const resultsCocienteDeBienestarPercibido = cocienteDeBienestarPercibido(report.computedForms[COMPUTED_FORMS.COCIENTE_DE_BIENESTAR_PERCIBIDO], reports);

  const anexoMental = computeResultsByComputedForm[COMPUTED_FORMS.ANEXO_MENTAL];
  const resultsAnexoMental = anexoMental(report.computedForms[COMPUTED_FORMS.ANEXO_MENTAL], reports);

  reports = {
    ...reports,
    [COMPUTED_FORMS.COCIENTE_DE_BIENESTAR_PERCIBIDO]: {
      ...resultsCocienteDeBienestarPercibido
    },
    [COMPUTED_FORMS.ANEXO_MENTAL]: {
      ...resultsAnexoMental
    }
  };

  return reports;
};

module.exports = reporteMetodoMaika;
