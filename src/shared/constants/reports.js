const CHARTS = require('./charts');
const {
  COMPUTED_FORMS,
  FORMS
} = require('./forms');

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
} = process.env;

const REPORTS = {
  REPORTE_CONSOLIDADO: {
    id: 'REPORTE_CONSOLIDADO',
    orientation: 'landscape',
    template: 'REPORTE_CONSOLIDADO.html'
  },
  REPORTE_METODO_MAIKA: {
    id: 'REPORTE_METODO_MAIKA',
    infography: 'metodoMaika',
    template: 'REPORTE_METODO_MAIKA.html',
    forms: {
      // [FORMS.FORMULARIO_MEDICO_ADN_MENTE]: {},
      // [FORMS.FORMULARIO_MEDICO_ADN_FISICO]: {},
      [FORMS.FORMULARIO_PACIENTE_SALUD_PHQ9]: {},
      [FORMS.FORMULARIO_PACIENTE_ESTRES_PERCIBIDO]: {},
      [FORMS.FORMULARIO_PACIENTE_TRANSTORNO_DE_ANSIEDAD_GENERALIZADA]: {},
      [FORMS.FORMULARIO_PACIENTE_SINTOMAS_MEDICOS]: {
        maxValue: 5,
        chartConfig: {
          type: CHARTS.RADAR,
          bounds: {
            x: 0,
            y: 0,
            width: 800,
            heigth: 500
          },
          xAxis: {
            label: {
              height: 60,
              width: 235,
              fontSize: 14,
              hAlign: 'center',
              vAlign: 'middle'
            }
          },
          yScale: {
            min: 0,
            max: 5,
            interval: 1
          }
        },
        tableBounds: {
          bad: 0,
          medium: 3,
          good: 5
        }
      }
    },
    computedForms: {
      [COMPUTED_FORMS.COCIENTE_DE_BIENESTAR_PONDERADO_CON_ADN]: {
        maxValue: 1,
        chartConfig: {
          type: CHARTS.RADAR,
          bounds: {
            x: 0,
            y: 0,
            width: 800,
            heigth: 600
          },
          xAxis: {
            label: {
              height: 60,
              width: 255,
              fontSize: 24,
              hAlign: 'center',
              vAlign: 'middle'
            }
          },
          yScale: {
            min: 0,
            max: 1,
            interval: 0.2
          }
        },
        tableBounds: {
          bad: 0,
          medium: 3,
          good: 5
        }
      },
      [COMPUTED_FORMS.ANEXO_MENTAL]: {
        maxValue: 100,
        chartConfig: {
          type: CHARTS.RADAR,
          bounds: {
            x: 0,
            y: 0,
            width: 900,
            heigth: 550
          },
          xAxis: {
            label: {
              height: 60,
              width: 180,
              fontSize: 28,
              hAlign: 'center',
              vAlign: 'middle'
            }
          },
          yScale: {
            min: 0,
            max: 100,
            interval: 20
          }
        },
        tableBounds: {
          bad: 0,
          medium: 3,
          good: 5
        }
      }
    }
    // chartConfig: {
    //   axisLabelHeight: 100,
    //   axisLabelWidth: 195,
    //   axisLabelFontSize: 18,
    //   hAlign: 'center'
    // },
    // forms: [
    //   FORMULARIO_MEDICO_ADN_MENTE,
    //   FORMULARIO_MEDICO_ADN_FISICO,
    //   FORMULARIO_PACIENTE_SINTOMAS_MEDICOS,
    //   FORMULARIO_PACIENTE_SALUD_PHQ9,
    //   FORMULARIO_PACIENTE_ESTRES_PERCIBIDO,
    //   FORMULARIO_PACIENTE_TRANSTORNO_DE_ANSIEDAD_GENERALIZADA
    // ],
    // hero: 'REPORTE_METODO_MAIKA',
    // id: 'REPORTE_METODO_MAIKA',
    // template: 'REPORTE_METODO_MAIKA.html',
    // title: 'Resumen'
  },
  REPORTE_TOTAL_CON_ADN: {
    id: 'REPORTE_TOTAL_CON_ADN',
    template: 'REPORTE_TOTAL_CON_ADN.html',
    hero: 'REPORTE_TOTAL_CON_ADN',
    forms: {
      // FORMULARIO_PACIENTE_SINTOMAS_MEDICOS: {},
      // FORMULARIO_PACIENTE_SALUD_PHQ9: {},
      // FORMULARIO_PACIENTE_ESTRES_PERCIBIDO: {},
      // FORMULARIO_PACIENTE_TRANSTORNO_DE_ANSIEDAD_GENERALIZADA: {},
      // [FORMS.FORMULARIO_MEDICO_FILTRO_ADN_FISICO]: {
      //   maxValue: 6,
      //   chartConfig: {
      //     type: CHARTS.RADAR,
      //     bounds: {
      //       x: 0,
      //       y: 0,
      //       width: 700,
      //       heigth: 500
      //     },
      //     xAxis: {
      //       label: {
      //         height: 60,
      //         width: 165,
      //         fontSize: 15,
      //         hAlign: 'center',
      //         vAlign: 'middle'
      //       }
      //     },
      //     yScale: {
      //       min: 0,
      //       max: 6,
      //       interval: 1
      //     }
      //   },
      //   tableBounds: {
      //     bad: 0,
      //     medium: 3,
      //     good: 5
      //   }
      // },
      // [FORMS.FORMULARIO_MEDICO_FILTRO_ADN_MENTE]: {
      //   maxValue: 6,
      //   chartConfig: {
      //     type: CHARTS.RADAR,
      //     bounds: {
      //       x: 0,
      //       y: 0,
      //       width: 700,
      //       heigth: 500
      //     },
      //     xAxis: {
      //       label: {
      //         height: 60,
      //         width: 165,
      //         fontSize: 15,
      //         hAlign: 'center',
      //         vAlign: 'middle'
      //       }
      //     },
      //     yScale: {
      //       min: 0,
      //       max: 6,
      //       interval: 1
      //     }
      //   },
      //   tableBounds: {
      //     bad: 0,
      //     medium: 3,
      //     good: 5
      //   }
      // }
    }
    // chartConfig: {
    //   axisLabelHeight: 50,
    //   axisLabelWidth: 115,
    //   axisLabelFontSize: 18,
    // },
    // forms: [
    //   // The same forms as the report above. 👆🏽👆🏽
    //   // FORMULARIO_MEDICO_ADN_MENTE,
    //   // FORMULARIO_MEDICO_ADN_FISICO,
    //   FORMULARIO_PACIENTE_SINTOMAS_MEDICOS,
    //   FORMULARIO_PACIENTE_SALUD_PHQ9,
    //   FORMULARIO_PACIENTE_ESTRES_PERCIBIDO,
    //   FORMULARIO_PACIENTE_TRANSTORNO_DE_ANSIEDAD_GENERALIZADA,
    //   // Next Forms
    //   FORMULARIO_MEDICO_FILTRO_ADN_FISICO,
    //   FORMULARIO_MEDICO_FILTRO_ADN_MENTE,
    // ],

    // id: 'REPORTE_TOTAL_CON_ADN',
    // infography: 'metodoMaika',
    // template: 'REPORTE_TOTAL_CON_ADN.html',
    // title: 'Resumen'
  },
  REPORTE_FISICO_ADN: {
    id: 'REPORTE_FISICO_ADN',
    template: 'REPORTE_FISICO_ADN.html',
    forms: {
      [FORMS.FORMULARIO_MEDICO_FILTRO_ADN_FISICO]: {
        maxValue: 6,
        chartConfig: {
          type: CHARTS.RADAR,
          bounds: {
            x: 0,
            y: 0,
            width: 700,
            heigth: 500
          },
          xAxis: {
            label: {
              height: 60,
              width: 165,
              fontSize: 17,
              hAlign: 'center',
              vAlign: 'middle'
            }
          },
          yScale: {
            min: 0,
            max: 6,
            interval: 1
          }
        },
        tableBounds: {
          bad: 0,
          medium: 3,
          good: 5
        }
      }
      // [FORMS.FORMULARIO_MEDICO_ADN_FISICO]: {}
    }
  },
  REPORTE_MENTAL_ADN: {
    id: 'REPORTE_MENTAL_ADN',
    template: 'REPORTE_MENTAL_ADN.html',
    forms: {
      [FORMS.FORMULARIO_MEDICO_FILTRO_ADN_MENTE]: {
        maxValue: 6,
        chartConfig: {
          type: CHARTS.RADAR,
          bounds: {
            x: 0,
            y: 0,
            width: 700,
            heigth: 500
          },
          xAxis: {
            label: {
              height: 60,
              width: 185,
              fontSize: 17,
              hAlign: 'center',
              vAlign: 'middle'
            }
          },
          yScale: {
            min: 0,
            max: 6,
            interval: 1
          }
        },
        tableBounds: {
          bad: 0,
          medium: 3,
          good: 5
        }
      }
      // [FORMS.FORMULARIO_MEDICO_ADN_MENTE]: {}
    }
  },
  REPORTE_MEDS_ADN: {
    hero: 'REPORTE_MEDS_ADN',
    id: 'REPORTE_MEDS_ADN',
    template: 'REPORTE_MEDS_ADN.html',
    title: 'Resumen Respuesta a Medicamentos',
    forms: {
      [FORMS.FORMULARIO_MEDICO_RESPUESTA_A_MEDICAMENTOS]: {
        maxValue: 6,
        chartConfig: {
          type: CHARTS.RADAR,
          bounds: {
            x: 0,
            y: 0,
            width: 700,
            heigth: 500
          },
          xAxis: {
            label: {
              height: 50,
              width: 145,
              fontSize: 17,
              hAlign: 'center',
              vAlign: 'middle'
            }
          },
          yScale: {
            min: 0,
            max: 7,
            interval: 1
          }
        },
        tableBounds: {
          bad: 0,
          medium: 3,
          good: 5
        }
      }
    }
  }
};

module.exports = REPORTS;
