const { ArrayUtils } = require('../../../shared/utils');

/**
 * @param {Object} report
 * @param {Object} results
 * @param {Object} formConfig
 * @returns {{
 *  date: string
 *  labels: Array<string>
 *  maxValues: Array<number>
 *  patientName: string
 *  values: Array<number>
 *  symptomsByChartSection: Array<Array<number>>
 * }}
 */
const computeResults = (report, formConfig, results) => {
  const labels = [
    'Cabeza',
    'Corazón',
    'Energía / Actividad',
    'Ojos',
    'Pulmones',
    'Mente',
    'Oídos',
    'Tracto Digestivo',
    'Salud Emomcional',
    'Nariz',
    'Músculos / Articulaciones',
    'Garganta / Boca',
    'Peso / Nutrición',
    'Derma',
    'Otros Físicos',
    // These 3 👇🏽 ARE NOT used for ReporteMaika but are used for Reporte Total 360.
    'Otros Relacionamiento',
    'Otros Espacios de Esparcimiento/Hobbies',
    'Otros Propósito en tu oficio'
  ];

  const symptomsByChartSection = [
    [
      results['Dolor de Cabeza'],
      results['Debilidad'],
      results['Mareo'],
      results['Insomnio']
    ],
    [
      results['Latidos Irregulares'],
      results['Palpitaciones'],
      results['Dolor en el Pecho']
    ],
    [
      results['Fatiga'],
      results['Apatía'],
      results['Hiperactividad'],
      results['Síndrome de Pierna Inquieta'],
      results['Descompensación Horaria']
    ],
    [
      results['Ojos llorosos o con picazón'],
      results['Párpados hinchados / enrojecidos'],
      results['Bolsas / Ojeras'],
      results['Visión borrosa o de túnel']
    ],
    [
      results['Congestión en el Pecho'],
      results['Asma / Bronquitis'],
      results['Dificultad para Respirar']
    ],
    [
      results['Dificultades de memoria'],
      results['Confusión / Bajo nivel de comprensión'],
      results['Dificultad para concentrarse'],
      results['Problemas de coordinación física'],
      results['Dificultad para tomar decisiones'],
      results['Tartamudeo'],
      results['Habla arrastrada'],
      results['Dificultades de Aprendizaje']
    ],
    [
      results['Picazón en los oídos'],
      results['Dolor de Oído / Infecciones'],
      results['Drenaje en oídos / Fluídos'],
      results['Pérdida de Audición']
    ],
    [
      results['Vómito / Nausea'],
      results['Diarrea'],
      results['Estreñimiento'],
      results['Sensación de Hinchazón'],
      results['Eructos / Gases'],
      results['Acidez Estomacal'],
      results['Dolor Intestinal / Estomacal']
    ],
    [
      results['Cambios de Humor'],
      results['Ansiedad / Miedos / Nerviosismo'],
      results['Enfado / Agresividad / Irritabilidad'],
      results['Depresión']
    ],
    [
      results['Congestión Nasal'],
      results['Problemas de los senos nasales'],
      results['Rinitis Alérgica'],
      results['Ataques de Estornudos'],
      results['Mucosidad Excesiva']
    ],
    [
      results['Dolor en Articulaciones'],
      results['Artrítis'],
      results['Rigidez / Limitación de Movimiento'],
      results['Dolor Muscular'],
      results['Debilidad y Cansancio']
    ],
    [
      results['Tos Crónica'],
      results['Arcadas / Carraspeo'],
      results['Dolor de Garganta / Ronquera'],
      results['Inflamación / Decoloración de lengua-encías-labios'],
      results['Aftas']
    ],
    [
      results['Impulso excesivo en la comida'],
      results['Ansia ciertos alimentos'],
      results['Exceso de peso'],
      results['Alimentación Compulsiva'],
      results['Retención de Agua'],
      results['Bajo Peso']
    ],
    [
      results['Acne'],
      results['Urticaria / Erupciones / Piel Seca'],
      results['Perdida de Cabello'],
      results['Enrojecimiento / Sofoco'],
      results['Sudor Excesivo']
    ],
    [
      results['Enfermedad Frecuente'],
      results['Micción frecuente y urgente'],
      results['Picazón Genital'],
      results['Dolor en los Huesos']
    ],
    [
      results['Cómo evalúas tu relacionamiento con tus familiares?'],
      results['Como evalúas tu relacionamiento con tu pareja?'],
      results['Cómo evalúas tu relacionamiento con tus amigos y/o colegas de trabajo?']
    ],
    [
      results['Cómo evalúas tus espacios de esparcimiento?'],
      results['Cómo evalúas tu conexión con otros en espacios diferentes al del trabajo o familiar?']
    ],
    [
      results['Que tan satisfactoria es tu conexión con tu tipo de trabajo u oficio?']
    ]
  ];

  const values = symptomsByChartSection.map((symptoms) => {
    return Math.ceil(((4 - ArrayUtils.getAverage(symptoms)) / 4) * 100);
  });

  const table = labels.map((label, index) => [label, values[index]]);
  const maxValues = labels.map((_) => formConfig.maxValue);

  return {
    date: results['Fecha'],
    labels,
    table,
    maxValues,
    patientName: results['Nombre del Paciente'],
    values,
    symptomsByChartSection
  };
};

module.exports = computeResults;
