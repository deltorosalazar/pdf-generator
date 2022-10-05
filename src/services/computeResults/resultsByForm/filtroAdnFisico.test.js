const filtroAdnFisico = require('./filtroAdnFisico');

test('filtroAdnFisico', () => {
  const FORM_CONFIG = {
    maxValue: 5
  };
  const mocks = [
    {
      results: {
        'Riesgo Cardiovascular': '4',
        'Riesgo Diabetes': '3',
        Sobrepeso: '3',
        Cancer: '3',
        'Enfermedad Autoinmune': '4',
        'Enfermedad del Colon': '2',
        'Enfermedad del Hígado': '2',
        Alzheimer: '2',
        Parkinson: '2',
        'Enfermedad Pulmonar': '4',
        Fatiga: '2'
      },
      expected: '0.56'
    },
    {
      results: {
        'Riesgo Cardiovascular': '4',
        'Riesgo Diabetes': '2',
        Sobrepeso: '2',
        Cancer: '4',
        'Enfermedad Autoinmune': '2',
        'Enfermedad del Colon': '3',
        'Enfermedad del Hígado': '4',
        Alzheimer: '2',
        Parkinson: '2',
        'Enfermedad Pulmonar': '2',
        Fatiga: '3'
      },
      expected: '0.55'
    },
    {
      results: {
        'Riesgo Cardiovascular': '4',
        'Riesgo Diabetes': '0',
        Sobrepeso: '3',
        Cancer: '4',
        'Enfermedad Autoinmune': '1',
        'Enfermedad del Colon': '1',
        'Enfermedad del Hígado': '0',
        Alzheimer: '4',
        Parkinson: '4',
        'Enfermedad Pulmonar': '3',
        Fatiga: '2'
      },
      expected: '0.47'
    },
    {
      results: {
        'Riesgo Cardiovascular': '4',
        'Riesgo Diabetes': '4',
        Sobrepeso: '0',
        Cancer: '4',
        'Enfermedad Autoinmune': '4',
        'Enfermedad del Colon': '2',
        'Enfermedad del Hígado': '4',
        Alzheimer: '1',
        Parkinson: '3',
        'Enfermedad Pulmonar': '2',
        Fatiga: '2'
      },
      expected: '0.55'
    },
    {
      results: {
        'Riesgo Cardiovascular': '2',
        'Riesgo Diabetes': '0',
        Sobrepeso: '1',
        Cancer: '0',
        'Enfermedad Autoinmune': '2',
        'Enfermedad del Colon': '1',
        'Enfermedad del Hígado': '4',
        Alzheimer: '1',
        Parkinson: '0',
        'Enfermedad Pulmonar': '3',
        Fatiga: '3'
      },
      expected: '0.31'
    }
  ];

  mocks.forEach((mock) => {
    expect(filtroAdnFisico({}, FORM_CONFIG, mock.results, -1)['wellnessQuotient']).toBe(mock.expected);
  });
});
