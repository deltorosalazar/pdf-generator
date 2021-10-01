/* eslint-disable max-len */
const computeResultsByForm = require('../resultsByForm');

const reporteMentalAdn = (report, results) => {
  const reports = Object.keys(report.forms).reduce((reportForms, currentFormID) => {
    return {
      ...reportForms,
      [currentFormID]: computeResultsByForm[currentFormID](report, report.forms[currentFormID], results[currentFormID])
    };
  }, {});

  return reports;
};

module.exports = reporteMentalAdn;
