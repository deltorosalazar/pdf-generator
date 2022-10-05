/* eslint-disable max-len */
const Logger = require('../../../shared/Logger');
const computeResultsByForm = require('../resultsByForm');

const respuestaMedicamentos = (language, report, results) => {
  Logger.log('📄 Reporte Respuesta a Medicamentos');

  const forms = report.forms.reduce((reportForms, form) => {
    const formID = form.id[language];

    console.log({ formID });

    return {
      ...reportForms,
      [formID]: computeResultsByForm[formID](report, form, results[formID])
    };
  }, {});

  return forms;
};

module.exports = respuestaMedicamentos;
