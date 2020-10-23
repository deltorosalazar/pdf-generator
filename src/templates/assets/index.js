const metodoMaika = require('./metodoMaika')

const REPORTE_METODO_MAIKA = require('./heroes/REPORTE_METODO_MAIKA')
const REPORTE_TOTAL_CON_ADN = require('./heroes/REPORTE_TOTAL_CON_ADN')
const REPORTE_FISICO_ADN = require('./heroes/REPORTE_FISICO_ADN')
const REPORTE_MENTAL_ADN = require('./heroes/REPORTE_MENTAL_ADN')
const REPORTE_MEDS_ADN = require('./heroes/REPORTE_MEDS_ADN')

module.exports = {
  metodoMaika,
  heroes: {
    REPORTE_METODO_MAIKA,
    REPORTE_TOTAL_CON_ADN,
    REPORTE_FISICO_ADN,
    REPORTE_MENTAL_ADN,
    REPORTE_MEDS_ADN
  }
}
