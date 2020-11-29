const {
  FORMULARIO_MEDICO_TOTAL_MENTE,
  FORMULARIO_MEDICO_TOTAL_FISICO,
  FORMULARIO_MEDICO_1_MENTE,
  FORMULARIO_MEDICO_1_FISICO,
  FORMULARIO_MEDICO_ADN_MENTE,
  FORMULARIO_MEDICO_ADN_FISICO,
  FORMULARIO_MEDICO_RESPUESTA_A_MEDICAMENTOS,
  FORMULARIO_MEDICO_FILTRO_ADN_MENTE,
  FORMULARIO_MEDICO_FILTRO_ADN_FISICO,
  FORMULARIO_PACIENTE_SINTOMAS_MEDICOS,
  FORMULARIO_PACIENTE_SALUD_PHQ9,
  FORMULARIO_PACIENTE_ESTRES_PERCIBIDO,
  FORMULARIO_PACIENTE_TRANSTORNO_DE_ANSIEDAD_GENERALIZADA
} = process.env

const REPORTS = {
  REPORTE_METODO_MAIKA: {
    chartConfig: {
      axisLabelHeight: 100,
      axisLabelWidth: 195,
      axisLabelFontSize: 18,
    },
    forms: [
      FORMULARIO_MEDICO_ADN_MENTE,
      FORMULARIO_MEDICO_ADN_FISICO,
      FORMULARIO_PACIENTE_SINTOMAS_MEDICOS,
      FORMULARIO_PACIENTE_SALUD_PHQ9,
      FORMULARIO_PACIENTE_ESTRES_PERCIBIDO,
      FORMULARIO_PACIENTE_TRANSTORNO_DE_ANSIEDAD_GENERALIZADA
    ],
    hero: 'REPORTE_METODO_MAIKA',
    id: 'REPORTE_METODO_MAIKA',
    infography: 'metodoMaika',
    template: 'REPORTE_METODO_MAIKA.html',
    title: 'Resumen',
  },
  REPORTE_TOTAL_CON_ADN: {
    chartConfig: {
      axisLabelHeight: 50,
      axisLabelWidth: 115,
      axisLabelFontSize: 18,
    },
    forms: [
      // The same forms as the report above. 👆🏽👆🏽
      FORMULARIO_MEDICO_ADN_MENTE,
      FORMULARIO_MEDICO_ADN_FISICO,
      FORMULARIO_PACIENTE_SINTOMAS_MEDICOS,
      FORMULARIO_PACIENTE_SALUD_PHQ9,
      FORMULARIO_PACIENTE_ESTRES_PERCIBIDO,
      FORMULARIO_PACIENTE_TRANSTORNO_DE_ANSIEDAD_GENERALIZADA,
      // Next Forms
      FORMULARIO_MEDICO_FILTRO_ADN_FISICO,
      FORMULARIO_MEDICO_FILTRO_ADN_MENTE,
    ],
    hero: 'REPORTE_TOTAL_CON_ADN',
    id: 'REPORTE_TOTAL_CON_ADN',
    infography: 'metodoMaika',
    template: 'REPORTE_TOTAL_CON_ADN.html',
    title: 'Resumen'
  },
  REPORTE_FISICO_ADN: {
    chartConfig: {
      axisLabelHeight: 60,
      axisLabelWidth: 145,
      axisLabelFontSize: 15,
    },
    forms: [
      FORMULARIO_MEDICO_FILTRO_ADN_FISICO,
      FORMULARIO_MEDICO_ADN_FISICO
    ],
    hero: 'REPORTE_FISICO_ADN',
    id: 'REPORTE_FISICO_ADN',
    maxValue: 5,
    template: 'REPORTE_FISICO_ADN.html',
    title: 'Resumen Valoración'
  },
  REPORTE_MENTAL_ADN: {
    chartConfig: {
      axisLabelHeight: 60,
      axisLabelWidth: 145,
      axisLabelFontSize: 15,
    },
    forms: [
      FORMULARIO_MEDICO_FILTRO_ADN_MENTE,
      FORMULARIO_MEDICO_ADN_MENTE
    ],
    hero: 'REPORTE_MENTAL_ADN',
    id: 'REPORTE_MENTAL_ADN',
    maxValue: 5,
    template: 'REPORTE_MENTAL_ADN.html',
    title: 'Reporte mental'
  },
  REPORTE_MEDS_ADN: {
    chartConfig: {
      axisLabelHeight: 50,
      axisLabelWidth: 145,
      axisLabelFontSize: 15,
    },
    forms: [
      FORMULARIO_MEDICO_RESPUESTA_A_MEDICAMENTOS
    ],
    hero: 'REPORTE_MEDS_ADN',
    id: 'REPORTE_MEDS_ADN',
    maxValue: 6,
    template: 'REPORTE_MEDS_ADN.html',
    title: 'Resumen Respuesta a Medicamentos',
  },
}

module.exports = REPORTS
