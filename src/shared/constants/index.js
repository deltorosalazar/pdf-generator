const CHARTS = require('./charts');
const { FORMS } = require('./forms');
const { COMPUTED_FORMS } = require('./computedForms');
const REPORTS = require('./reports');

const EMAIL_STATUS = {
  SENT: 'sent',
  QUEUE: 'queue',
  FAILED: 'failed'
};

module.exports = {
  CHARTS,
  COMPUTED_FORMS,
  FORMS,
  REPORTS,
  EMAIL_STATUS
};
