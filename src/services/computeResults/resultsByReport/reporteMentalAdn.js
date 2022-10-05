/* eslint-disable max-len */
const Logger = require('../../../shared/Logger');
const computeResultsByForm = require('../resultsByForm');

const reporteMentalAdn = (language, report, results) => {
  Logger.log('📄 Reporte Mental ADN');

  const forms = report.forms.reduce((reportForms, form) => {
    const formID = form.id[language];

    return {
      ...reportForms,
      [formID]: computeResultsByForm[formID](report, form, results[formID])
    };
  }, {});

  return forms;
};

module.exports = reporteMentalAdn;
