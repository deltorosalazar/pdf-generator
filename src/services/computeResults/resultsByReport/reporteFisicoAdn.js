/* eslint-disable max-len */
const Logger = require('../../../shared/Logger');
const computeResultsByForm = require('../resultsByForm');

const reporteFisicoAdn = (language, report, results) => {
  Logger.log('📄 Reporte Físico ADN');
  Logger.log({
    forms: report.forms.map((form) => form.id),
    results
  });

  const forms = report.forms.reduce((reportForms, form) => {
    const formID = form.id[language];

    return {
      ...reportForms,
      [formID]: computeResultsByForm[formID](report, form, results[formID])
    };
  }, {});

  return forms;
};

module.exports = reporteFisicoAdn;
