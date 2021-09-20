const { REPORTS } = require('../../../shared/constants');
const reporteRespuestaMedicamentos = require('./respuestaMedicamentos');
const reporteMentalAdn = require('./reporteMentalAdn');
const reporteFisicoAdn = require('./reporteFisicoAdn');
const reporteTotalAdn = require('./reporteTotalAdn');
const reporteMetodoMaika = require('./reporteMetodoMaika');

const resultsByReport = {
  [REPORTS.REPORTE_MEDS_ADN.id]: reporteRespuestaMedicamentos,
  [REPORTS.REPORTE_MENTAL_ADN.id]: reporteMentalAdn,
  [REPORTS.REPORTE_FISICO_ADN.id]: reporteFisicoAdn,
  [REPORTS.REPORTE_TOTAL_CON_ADN.id]: reporteTotalAdn,
  [REPORTS.REPORTE_METODO_MAIKA.id]: reporteMetodoMaika
};

module.exports = resultsByReport;
