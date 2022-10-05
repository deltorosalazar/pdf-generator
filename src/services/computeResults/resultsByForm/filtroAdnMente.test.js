const filtroAdnMente = require('./filtroAdnMente');

test('filtroAdnMente', () => {
  const FORM_CONFIG = {
    maxValue: 5
  };
  const mocks = [
    {
      results: {
        'Stress & Anxiety': '2',
        Mood: '3',
        'Openness to Experience': '3',
        Cancer: '2',
        'Memory Performance': '5',
        'Cognitive Function': '2',
        Attention: '2',
        Extraversion: '3',
        'Obsessive-Compulsive Tendencies': '2'
      },
      expected: '0.53'
    },
    {
      results: {
        'Stress & Anxiety': '5',
        Mood: '3',
        'Openness to Experience': '3',
        Cancer: '0',
        'Memory Performance': '2',
        'Cognitive Function': '4',
        Attention: '2',
        Extraversion: '1',
        'Obsessive-Compulsive Tendencies': '2'
      },
      expected: '0.49'
    },
    {
      results: {
        'Stress & Anxiety': '4',
        Mood: '0',
        'Openness to Experience': '4',
        Cancer: '3',
        'Memory Performance': '4',
        'Cognitive Function': '1',
        Attention: '4',
        Extraversion: '5',
        'Obsessive-Compulsive Tendencies': '3'
      },
      expected: '0.62'
    },
    {
      results: {
        'Stress & Anxiety': '1',
        Mood: '0',
        'Openness to Experience': '4',
        Cancer: '2',
        'Memory Performance': '1',
        'Cognitive Function': '1',
        Attention: '0',
        Extraversion: '0',
        'Obsessive-Compulsive Tendencies': '5'
      },
      expected: '0.31'
    },
    {
      results: {
        'Stress & Anxiety': '2',
        Mood: '5',
        'Openness to Experience': '4',
        Cancer: '3',
        'Memory Performance': '2',
        'Cognitive Function': '5',
        Attention: '1',
        Extraversion: '4',
        'Obsessive-Compulsive Tendencies': '4'
      },
      expected: '0.67'
    }
  ];

  mocks.forEach((mock) => {
    expect(filtroAdnMente({}, FORM_CONFIG, mock.results, -1)['wellnessQuotient']).toBe(mock.expected);
  });
});
