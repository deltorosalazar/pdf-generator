const CHARTS = require('./charts');
// const {
//   COMPUTED_FORMS,
//   FORMS
// } = require('./forms');

const REPORTS = {
  // REPORTE_TOTAL_CON_ADN: {
  //   id: 'REPORTE_TOTAL_CON_ADN',
  //   template: {
  //     es: 'REPORTE_TOTAL_CON_ADN.html',
  //     en: 'REPORTE_TOTAL_CON_ADN.html'
  //   },
  //   forms: [
  //     {
  //       id: {
  //         es: process.env.FORMULARIO_PACIENTE_SALUD_PHQ9__ES,
  //         en: process.env.FORMULARIO_PACIENTE_SALUD_PHQ9__EN
  //       }
  //     },
  //     {
  //       id: {
  //         es: process.env.FORMULARIO_PACIENTE_ESTRES_PERCIBIDO__ES,
  //         en: process.env.FORMULARIO_PACIENTE_ESTRES_PERCIBIDO__EN
  //       }
  //     },
  //     {
  //       id: {
  //         es: process.env.FORMULARIO_PACIENTE_TRANSTORNO_DE_ANSIEDAD_GENERALIZADA__ES,
  //         en: process.env.FORMULARIO_PACIENTE_TRANSTORNO_DE_ANSIEDAD_GENERALIZADA__EN
  //       }
  //     },
  //     {
  //       id: {
  //         es: process.env.FORMULARIO_PACIENTE_SINTOMAS_MEDICOS__ES,
  //         en: process.env.FORMULARIO_PACIENTE_SINTOMAS_MEDICOS__EN
  //       }
  //     },
  //     {
  //       id: {
  //         es: process.env.FORMULARIO_MEDICO_FILTRO_ADN_MENTE__ES,
  //         en: process.env.FORMULARIO_MEDICO_FILTRO_ADN_MENTE__EN
  //       }
  //     },
  //     {
  //       id: {
  //         es: process.env.FORMULARIO_MEDICO_FILTRO_ADN_FISICO__ES,
  //         en: process.env.FORMULARIO_MEDICO_FILTRO_ADN_FISICO__EN
  //       },
  //       maxValue: 5,
  //       tableBounds: {
  //         bad: 0,
  //         medium: 3,
  //         good: 4
  //       }
  //     }
  //   ]
  // },
  REPORTE_MEDICAMENTOS_ADN: {
    id: 'REPORTE_MEDICAMENTOS_ADN',
    template: {
      es: 'REPORTE_MEDICAMENTOS_ADN_ES.html',
      en: 'REPORTE_MEDICAMENTOS_ADN_EN.html'
    },
    forms: [
      {
        id: {
          es: process.env.FORMULARIO_MEDICO_RESPUESTA_A_MEDICAMENTOS__ES,
          en: process.env.FORMULARIO_MEDICO_RESPUESTA_A_MEDICAMENTOS__EN
        },
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
              width: 165,
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
    ],
    computedForms: []
  },
  REPORTE_MENTAL_ADN: {
    id: 'REPORTE_MENTAL_ADN',
    template: {
      es: 'REPORTE_MENTAL_ADN_ES.html',
      en: 'REPORTE_MENTAL_ADN_EN.html'
    },
    forms: [
      {
        id: {
          es: process.env.FORMULARIO_MEDICO_FILTRO_ADN_MENTE__ES,
          en: process.env.FORMULARIO_MEDICO_FILTRO_ADN_MENTE__EN
        },
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
    ],
    computedForms: []
  },
  REPORTE_FISICO_ADN: {
    id: 'REPORTE_FISICO_ADN',
    template: {
      es: 'REPORTE_FISICO_ADN_ES.html',
      en: 'REPORTE_FISICO_ADN_EN.html'
    },
    forms: [
      {
        id: {
          es: process.env.FORMULARIO_MEDICO_FILTRO_ADN_FISICO__ES,
          en: process.env.FORMULARIO_MEDICO_FILTRO_ADN_FISICO__EN
        },
        maxValue: 5,
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
            max: 5,
            interval: 1
          }
        },
        tableBounds: {
          bad: 0,
          medium: 3,
          good: 4
        }
      }
    ],
    computedForms: []
  },
  REPORTE_TOTAL_CON_ADN: {
    id: 'REPORTE_TOTAL_CON_ADN',
    template: {
      es: 'REPORTE_TOTAL_CON_ADN_ES.html',
      en: 'REPORTE_TOTAL_CON_ADN_EN.html'
    },
    infography: {
      es: 'metodoMaika__es',
      en: 'metodoMaika__en'
    },
    forms: [
      {
        id: {
          es: process.env.FORMULARIO_PACIENTE_SALUD_PHQ9__ES,
          en: process.env.FORMULARIO_PACIENTE_SALUD_PHQ9__EN
        }
      },
      {
        id: {
          es: process.env.FORMULARIO_PACIENTE_ESTRES_PERCIBIDO__ES,
          en: process.env.FORMULARIO_PACIENTE_ESTRES_PERCIBIDO__EN
        }
      },
      {
        id: {
          es: process.env.FORMULARIO_PACIENTE_TRANSTORNO_DE_ANSIEDAD_GENERALIZADA__ES,
          en: process.env.FORMULARIO_PACIENTE_TRANSTORNO_DE_ANSIEDAD_GENERALIZADA__EN
        }
      },
      {
        id: {
          es: process.env.FORMULARIO_PACIENTE_SINTOMAS_MEDICOS__ES,
          en: process.env.FORMULARIO_PACIENTE_SINTOMAS_MEDICOS__EN
        },
        maxValue: 100,
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
            max: 100,
            interval: 20
          }
        },
        tableBounds: {
          bad: 0,
          medium: 50,
          good: 80
        }
      },
      {
        id: {
          es: process.env.FORMULARIO_MEDICO_FILTRO_ADN_MENTE__ES,
          en: process.env.FORMULARIO_MEDICO_FILTRO_ADN_MENTE__EN
        }
      },
      {
        id: {
          es: process.env.FORMULARIO_MEDICO_FILTRO_ADN_FISICO__ES,
          en: process.env.FORMULARIO_MEDICO_FILTRO_ADN_FISICO__EN
        },
        maxValue: 5,
        tableBounds: {
          bad: 0,
          medium: 3,
          good: 4
        }
      }
    ],
    computedForms: [
      {
        id: 'COCIENTE_DE_BIENESTAR_PERCIBIDO',
        maxValue: 100
      },
      {
        id: 'COCIENTE_DE_BIENESTAR_PONDERADO_CON_ADN',
        maxValue: 5,
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
            max: 5,
            interval: 1
          }
        },
        tableBounds: {
          bad: 0,
          medium: 50,
          good: 80
        }
      }
    ]
  },
  REPORTE_METODO_MAIKA: {
    id: 'REPORTE_METODO_MAIKA',
    infography: {
      es: 'metodoMaika__es',
      en: 'metodoMaika__en'
    },
    template: {
      es: 'REPORTE_METODO_MAIKA_ES.html',
      en: 'REPORTE_METODO_MAIKA_EN.html'
    },
    forms: [
      {
        id: {
          es: process.env.FORMULARIO_PACIENTE_SALUD_PHQ9__ES,
          en: process.env.FORMULARIO_PACIENTE_SALUD_PHQ9__EN
        }
      },
      {
        id: {
          es: process.env.FORMULARIO_PACIENTE_ESTRES_PERCIBIDO__ES,
          en: process.env.FORMULARIO_PACIENTE_ESTRES_PERCIBIDO__EN
        }
      },
      {
        id: {
          es: process.env.FORMULARIO_PACIENTE_TRANSTORNO_DE_ANSIEDAD_GENERALIZADA__ES,
          en: process.env.FORMULARIO_PACIENTE_TRANSTORNO_DE_ANSIEDAD_GENERALIZADA__EN
        }
      },
      {
        id: {
          es: process.env.FORMULARIO_PACIENTE_SINTOMAS_MEDICOS__ES,
          en: process.env.FORMULARIO_PACIENTE_SINTOMAS_MEDICOS__EN
        },
        maxValue: 100,
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
            max: 100,
            interval: 20
          }
        },
        tableBounds: {
          bad: 0,
          medium: 50,
          good: 80
        }
      }
    ],
    computedForms: [
      {
        id: 'COCIENTE_DE_BIENESTAR_PERCIBIDO',
        maxValue: 100,
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
            max: 100,
            interval: 20
          }
        },
        tableBounds: {
          bad: 0,
          medium: 50,
          good: 80
        }
      },
      {
        id: 'ANEXO_MENTAL',
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
          bad: 80,
          medium: 50,
          good: 0
        }
      }
    ]
  }
};

// const REPORTS = {
//   REPORTE_CONSOLIDADO: {
//     id: 'REPORTE_CONSOLIDADO',
//     orientation: 'landscape',
//     infography: 'metodoMaika',
//     template: {
//       base: 'REPORTE_CONSOLIDADO.html',
//       en: 'REPORTE_CONSOLIDADO.html'
//     },
//     forms: {
//       [FORMS.FORMULARIO_MEDICO_RESPUESTA_A_MEDICAMENTOS]: {
//         maxValue: 6,
//         chartConfig: {
//           type: CHARTS.RADAR,
//           bounds: {
//             x: 0,
//             y: 0,
//             width: 700,
//             heigth: 500
//           },
//           xAxis: {
//             label: {
//               height: 50,
//               width: 165,
//               fontSize: 17,
//               hAlign: 'center',
//               vAlign: 'middle'
//             }
//           },
//           yScale: {
//             min: 0,
//             max: 7,
//             interval: 1
//           }
//         },
//         tableBounds: {
//           bad: 0,
//           medium: 3,
//           good: 5
//         }
//       }
//     }
//   },
//   REPORTE_METODO_MAIKA: {
//     id: 'REPORTE_METODO_MAIKA',
//     infography: 'metodoMaika',
//     template: {
//       base: 'REPORTE_METODO_MAIKA.html',
//       en: 'REPORTE_METODO_MAIKA.html'
//     },
//     forms: {
//       // [FORMS.FORMULARIO_MEDICO_ADN_MENTE]: {},
//       // [FORMS.FORMULARIO_MEDICO_ADN_FISICO]: {},
//       [FORMS.FORMULARIO_PACIENTE_SALUD_PHQ9]: {},
//       [FORMS.FORMULARIO_PACIENTE_ESTRES_PERCIBIDO]: {},
//       [FORMS.FORMULARIO_PACIENTE_TRANSTORNO_DE_ANSIEDAD_GENERALIZADA]: {},
//       [FORMS.FORMULARIO_PACIENTE_SINTOMAS_MEDICOS]: {
//         maxValue: 100,
//         chartConfig: {
//           type: CHARTS.RADAR,
//           bounds: {
//             x: 0,
//             y: 0,
//             width: 800,
//             heigth: 500
//           },
//           xAxis: {
//             label: {
//               height: 60,
//               width: 235,
//               fontSize: 14,
//               hAlign: 'center',
//               vAlign: 'middle'
//             }
//           },
//           yScale: {
//             min: 0,
//             max: 100,
//             interval: 20
//           }
//         },
//         tableBounds: {
//           bad: 0,
//           medium: 50,
//           good: 80
//         }
//       }
//     },
//     computedForms: {
//       [COMPUTED_FORMS.COCIENTE_DE_BIENESTAR_PERCIBIDO]: {
//         maxValue: 100,
//         chartConfig: {
//           type: CHARTS.RADAR,
//           bounds: {
//             x: 0,
//             y: 0,
//             width: 800,
//             heigth: 600
//           },
//           xAxis: {
//             label: {
//               height: 60,
//               width: 255,
//               fontSize: 24,
//               hAlign: 'center',
//               vAlign: 'middle'
//             }
//           },
//           yScale: {
//             min: 0,
//             max: 100,
//             interval: 20
//           }
//         },
//         tableBounds: {
//           bad: 0,
//           medium: 50,
//           good: 80
//         }
//       },
//       [COMPUTED_FORMS.ANEXO_MENTAL]: {
//         maxValue: 100,
//         chartConfig: {
//           type: CHARTS.RADAR,
//           bounds: {
//             x: 0,
//             y: 0,
//             width: 900,
//             heigth: 550
//           },
//           xAxis: {
//             label: {
//               height: 60,
//               width: 180,
//               fontSize: 28,
//               hAlign: 'center',
//               vAlign: 'middle'
//             }
//           },
//           yScale: {
//             min: 0,
//             max: 100,
//             interval: 20
//           }
//         },
//         tableBounds: {
//           bad: 80,
//           medium: 50,
//           good: 0
//         }
//       }
//     }
//   },
//   REPORTE_TOTAL_CON_ADN: {
//     id: 'REPORTE_TOTAL_CON_ADN',
//     template: 'REPORTE_TOTAL_CON_ADN.html',
//     infography: 'metodoMaika',
//     forms: {
//       [FORMS.FORMULARIO_PACIENTE_SALUD_PHQ9]: {},
//       [FORMS.FORMULARIO_PACIENTE_ESTRES_PERCIBIDO]: {},
//       [FORMS.FORMULARIO_PACIENTE_TRANSTORNO_DE_ANSIEDAD_GENERALIZADA]: {},
//       [FORMS.FORMULARIO_PACIENTE_SINTOMAS_MEDICOS]: {},
//       [FORMS.FORMULARIO_MEDICO_FILTRO_ADN_MENTE]: {},
//       [FORMS.FORMULARIO_MEDICO_FILTRO_ADN_FISICO]: {
//         maxValue: 5,
//         tableBounds: {
//           bad: 0,
//           medium: 3,
//           good: 4
//         }
//       }
//     },
//     computedForms: {
//       [COMPUTED_FORMS.COCIENTE_DE_BIENESTAR_PERCIBIDO]: {
//         maxValue: 100
//       },
//       [COMPUTED_FORMS.COCIENTE_DE_BIENESTAR_PONDERADO_CON_ADN]: {
//         maxValue: 5,
//         chartConfig: {
//           type: CHARTS.RADAR,
//           bounds: {
//             x: 0,
//             y: 0,
//             width: 800,
//             heigth: 600
//           },
//           xAxis: {
//             label: {
//               height: 60,
//               width: 255,
//               fontSize: 24,
//               hAlign: 'center',
//               vAlign: 'middle'
//             }
//           },
//           yScale: {
//             min: 0,
//             max: 5,
//             interval: 1
//           }
//         },
//         tableBounds: {
//           bad: 0,
//           medium: 50,
//           good: 80
//         }
//       }
//     }
//   },
//   REPORTE_FISICO_ADN: {
//     id: 'REPORTE_FISICO_ADN',
//     template: {
//       base: 'REPORTE_FISICO_ADN.html',
//       en: 'REPORTE_FISICO_ADN.html'
//     },
//     forms: {
//       'base': {
//         [FORMS.FORMULARIO_MEDICO_FILTRO_ADN_FISICO]: {
//           maxValue: 5,
//           chartConfig: {
//             type: CHARTS.RADAR,
//             bounds: {
//               x: 0,
//               y: 0,
//               width: 700,
//               heigth: 500
//             },
//             xAxis: {
//               label: {
//                 height: 60,
//                 width: 165,
//                 fontSize: 17,
//                 hAlign: 'center',
//                 vAlign: 'middle'
//               }
//             },
//             yScale: {
//               min: 0,
//               max: 5,
//               interval: 1
//             }
//           },
//           tableBounds: {
//             bad: 0,
//             medium: 3,
//             good: 4
//           }
//         }
//       },
//       'en': {
//         [FORMS.FORMULARIO_MEDICO_FILTRO_ADN_FISICO]: {
//           maxValue: 5,
//           chartConfig: {
//             type: CHARTS.RADAR,
//             bounds: {
//               x: 0,
//               y: 0,
//               width: 700,
//               heigth: 500
//             },
//             xAxis: {
//               label: {
//                 height: 60,
//                 width: 165,
//                 fontSize: 17,
//                 hAlign: 'center',
//                 vAlign: 'middle'
//               }
//             },
//             yScale: {
//               min: 0,
//               max: 5,
//               interval: 1
//             }
//           },
//           tableBounds: {
//             bad: 0,
//             medium: 3,
//             good: 4
//           }
//         }
//       }
//     }
//   },
//   REPORTE_MENTAL_ADN: {
//     id: 'REPORTE_MENTAL_ADN',
//     template: {
//       base: 'REPORTE_MENTAL_ADN.html',
//       en: 'REPORTE_MENTAL_ADN.html'
//     },
//     forms: {
//       [FORMS.FORMULARIO_MEDICO_FILTRO_ADN_MENTE]: {
//         maxValue: 6,
//         chartConfig: {
//           type: CHARTS.RADAR,
//           bounds: {
//             x: 0,
//             y: 0,
//             width: 700,
//             heigth: 500
//           },
//           xAxis: {
//             label: {
//               height: 60,
//               width: 185,
//               fontSize: 17,
//               hAlign: 'center',
//               vAlign: 'middle'
//             }
//           },
//           yScale: {
//             min: 0,
//             max: 6,
//             interval: 1
//           }
//         },
//         tableBounds: {
//           bad: 0,
//           medium: 3,
//           good: 5
//         }
//       }
//       // [FORMS.FORMULARIO_MEDICO_ADN_MENTE]: {}
//     }
//   },
//   REPORTE_MEDS_ADN: {
//     hero: 'REPORTE_MEDS_ADN',
//     id: 'REPORTE_MEDS_ADN',
//     template: {
//       base: 'REPORTE_MEDS_ADN.html',
//       en: 'REPORTE_MEDS_ADN.html'
//     },
//     title: 'Resumen Respuesta a Medicamentos',
//     forms: {
//       [FORMS.FORMULARIO_MEDICO_RESPUESTA_A_MEDICAMENTOS]: {
//         maxValue: 6,
//         chartConfig: {
//           type: CHARTS.RADAR,
//           bounds: {
//             x: 0,
//             y: 0,
//             width: 700,
//             heigth: 500
//           },
//           xAxis: {
//             label: {
//               height: 50,
//               width: 165,
//               fontSize: 17,
//               hAlign: 'center',
//               vAlign: 'middle'
//             }
//           },
//           yScale: {
//             min: 0,
//             max: 7,
//             interval: 1
//           }
//         },
//         tableBounds: {
//           bad: 0,
//           medium: 3,
//           good: 5
//         }
//       }
//     }
//   }
// };

module.exports = REPORTS;
