/* eslint-disable max-len */
const { FORMS, COMPUTED_FORMS } = require('../../../shared/constants');
const { ArrayUtils } = require('../../../shared/utils');
const computeResultsByForm = require('../resultsByForm');
const computeResultsByComputedForm = require('../resultsByComputedForm');

const reporteMetodoMaika = (report, results) => {
  let reports = Object.keys(report.forms).reduce((reportForms, currentFormID) => {
    return {
      ...reportForms,
      [currentFormID]: computeResultsByForm[currentFormID](report, report.forms[currentFormID], results[currentFormID])
    };
  }, {});

  // const sintomasPorSeccion = reports[FORMS.FORMULARIO_PACIENTE_SINTOMAS_MEDICOS].symptomsByChartSection
  // const saludPhq9 = reports[FORMS.FORMULARIO_PACIENTE_SALUD_PHQ9].values;
  // const estresPercibido = reports[FORMS.FORMULARIO_PACIENTE_ESTRES_PERCIBIDO].values;
  // const transtornoAnsiedad = reports[FORMS.FORMULARIO_PACIENTE_TRANSTORNO_DE_ANSIEDAD_GENERALIZADA].values;

  const cocienteDeBienestarPonderado = computeResultsByComputedForm[COMPUTED_FORMS.COCIENTE_DE_BIENESTAR_PONDERADO_CON_ADN];
  const resultsCocienteDeBienestarPonderado = cocienteDeBienestarPonderado(report.computedForms[COMPUTED_FORMS.COCIENTE_DE_BIENESTAR_PONDERADO_CON_ADN], reports);

  const anexoMental = computeResultsByComputedForm[COMPUTED_FORMS.ANEXO_MENTAL];
  const resultsAnexoMental = anexoMental(report.computedForms[COMPUTED_FORMS.ANEXO_MENTAL], reports);

  reports = {
    ...reports,
    [COMPUTED_FORMS.COCIENTE_DE_BIENESTAR_PONDERADO_CON_ADN]: {
      ...resultsCocienteDeBienestarPonderado
    },
    [COMPUTED_FORMS.ANEXO_MENTAL]: {
      ...resultsAnexoMental
    }
  };

  return reports;
};

module.exports = reporteMetodoMaika;
