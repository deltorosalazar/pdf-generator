const { ArrayUtils } = require('../../../shared/utils');

const FORM_LABELS = [
  'Headaches',
  'Faintness',
  'Dizziness',
  'Insomnia',
  'Irregular or skipped heartbeat',
  'Rapid or pounding heartbeat',
  'Chest pain',
  'Fatigue, sluggishness',
  'Apathy, Lethargy',
  'Hyperactivity',
  'Restlessness',
  'Jet lag',
  'Watery or itchy eyes',
  'Swollen, reddened or sticky eyelids',
  'Bags or dark circles under eyes',
  'Blurred or tunnel vision (Does not include near of far-sightedness)',
  'Chest Congestion',
  'Asthma / Bronchitis',
  'Shortness of breath',
  'Poor Memory',
  'Confusion, poor comprehension',
  'Poor concentration',
  'Poor physical coordination',
  'Difficulty in making decisions',
  'Stuttering or stammering',
  'Slurred speech',
  'Learning disabilities',
  'Itchy ears',
  'Earaches, ear infections',
  'Drainage from ear',
  'Ringing in ears, hearing loss',
  'Nausea, vomiting',
  'Diarrhea',
  'Constipation',
  'Bloated feeling',
  'Belching, passing gas',
  'Heartburn',
  'Intestinal / stomach pain',
  'Mood swings',
  'Anxiety, fear, nervousness',
  'Anger, irritability, aggressiveness',
  'Depression',
  'Stuffy nose',
  'Sinus problems',
  'Hey Fever',
  'Sneezing attacks',
  'Excessive mucus formation',
  'Pain or aches in joints',
  'Arthrítis',
  'Stiffness or limitation of movement',
  'Pain or aches in muscles',
  'Feeling of weakness or tiredness',
  'Chronic coughing',
  'Gagging, frequent need to clear throat',
  'Sore throat, hoarseness, loss of voice',
  'Swollen or discolored tongue, gums, lips',
  'Canker sores',
  'Binge eating/drinking',
  'Craving certain foods',
  'Excessive weight',
  'Compulsive eating',
  'Water retention',
  'Underweight',
  'Acne',
  'Hives, rashes, dry skin',
  'Hair loss',
  'Flushing, hot flashes',
  'Excessive sweating',
  'Frequent illness',
  'Frequent or urgent orination',
  'Genital itch or discharge',
  'Bone-ache',
  'How do you relate to your family?',
  'How do you relate to your partner?',
  'How do you relate to your friends and colleagues at work',
  'How do you evaluate your hobbies in life ?',
  'How do you evaluate your relationships around hobbies or other spaces different than work?',
  'How satisfying is your work for you?'
];

/**
 *
 * @param {*} labels
 * @param {*} results
 * @returns
 */
const checkLabelsOnResults = (labels, results) => {
  const resultsKeys = Object.keys(results);
  // console.log({ labels });
  const missingLabels = resultsKeys.filter((key) => labels.indexOf(key) === -1);

  if (missingLabels.length) {
    throw new Error(`Missing Keys: [${missingLabels.join(', ')}]`);
  }

  return true;
};

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
  console.log('Formulario Síntomas Médicos (EN)');

  const labels = [
    'Head',
    'Heart',
    'Energy',
    'Eyes',
    'Lungs',
    'Mind',
    'Ears',
    'Gut Heatlh',
    'Emotional',
    'Nose',
    'Skeletal Muscle',
    'Mouth Throat',
    'Weight',
    'Derma',
    'Others',
    // These 3 👇🏽 ARE NOT used for ReporteMaika but are used for Reporte Total 360.
    // 'Otros Relacionamiento',
    // 'Otros Espacios de Esparcimiento/Hobbies',
    // 'Otros Propósito en tu oficio'
  ];

  const symptomsByChartSection = [
    [
      results['Headaches'],
      results['Faintness'],
      results['Dizziness'],
      results['Insomnia']
    ],
    [
      results['Irregular or skipped heartbeat'],
      results['Rapid or pounding heartbeat'],
      results['Chest pain']
    ],
    [
      results['Fatigue, sluggishness'],
      results['Apathy, Lethargy'],
      results['Hyperactivity'],
      results['Restlessness'],
      results['Jet lag']
    ],
    [
      results['Watery or itchy eyes'],
      results['Swollen, reddened or sticky eyelids'],
      results['Bags or dark circles under eyes'],
      results['Blurred or tunnel vision (Does not include near of far-sightedness)']
    ],
    [
      results['Chest Congestion'],
      results['Asthma / Bronchitis'],
      results['Shortness of breath']
    ],
    [
      results['Poor Memory'],
      results['Confusion, poor comprehension'],
      results['Poor concentration'],
      results['Poor physical coordination'],
      results['Difficulty in making decisions'],
      results['Stuttering or stammering'],
      results['Slurred speech'],
      results['Learning disabilities']
    ],
    [
      results['Itchy ears'],
      results['Earaches, ear infections'],
      results['Drainage from ear'],
      results['Ringing in ears, hearing loss']
    ],
    [
      results['Nausea, vomiting'],
      results['Diarrhea'],
      results['Constipation'],
      results['Bloated feeling'],
      results['Belching, passing gas'],
      results['Heartburn'],
      results['Intestinal / stomach pain']
    ],
    [
      results['Mood swings'],
      results['Anxiety, fear, nervousness'],
      results['Anger, irritability, aggressiveness'],
      results['Depression']
    ],
    [
      results['Stuffy nose'],
      results['Sinus problems'],
      results['Hey Fever'],
      results['Sneezing attacks'],
      results['Excessive mucus formation']
    ],
    [
      results['Pain or aches in joints'],
      results['Arthrítis'],
      results['Stiffness or limitation of movement'],
      results['Pain or aches in muscles'],
      results['Feeling of weakness or tiredness']
    ],
    [
      results['Chronic coughing'],
      results['Gagging, frequent need to clear throat'],
      results['Sore throat, hoarseness, loss of voice'],
      results['Swollen or discolored tongue, gums, lips'],
      results['Canker sores']
    ],
    [
      results['Binge eating/drinking'],
      results['Craving certain foods'],
      results['Excessive weight'],
      results['Compulsive eating'],
      results['Water retention'],
      results['Underweight']
    ],
    [
      results['Acne'],
      results['Hives, rashes, dry skin'],
      results['Hair loss'],
      results['Flushing, hot flashes'],
      results['Excessive sweating']
    ],
    [
      results['Frequent illness'],
      results['Frequent or urgent orination'],
      results['Genital itch or discharge'],
      results['Bone-ache']
    ],
    [
      results['How do you relate to your family?'],
      results['How do you relate to your partner?'],
      results['How do you relate to your friends and colleagues at work']
    ],
    [
      results['How do you evaluate your hobbies in life ?'],
      results['How do you evaluate your relationships around hobbies or other spaces different than work?']
    ],
    [
      results['How satisfying is your work for you?']
    ]
  ];

  const values = symptomsByChartSection.map((symptoms) => {
    return Math.round(((4 - ArrayUtils.getAverage(symptoms)) / 4) * 100);
  });

  const table = labels.map((label, index) => [label, values[index]]);
  const maxValues = labels.map((_) => formConfig.maxValue);
  const wellnessQuotient = (values
    .filter((value, index) => {
      return index <= 14;
    })
    .reduce((acc, curr) => {
      return acc + curr;
    }, 0) / 1500).toFixed(2);

  return {
    date: results['Date'],
    labels,
    table,
    maxValues,
    patientName: results["Patient's Name"],
    values,
    symptomsByChartSection,
    wellnessQuotient,
    tableBounds: formConfig.tableBounds
  };
};

module.exports = computeResults;
