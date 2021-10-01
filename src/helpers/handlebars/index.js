const handlebars = require('handlebars');
const Logger = require('../../shared/Logger');

handlebars.registerHelper('setColor', (value, badBound, mediumBound, goodBound) => {
  const parsedValue = parseFloat(value);

  Logger.log({
    value: parsedValue, badBound, mediumBound, goodBound
  });

  if (parsedValue >= badBound && parsedValue < mediumBound) {
    return 'red';
  }

  if (parsedValue >= mediumBound && parsedValue < goodBound) {
    return 'orange';
  }

  return 'green';
});

handlebars.registerHelper('getValueAtIndex', (array, index) => {
  const valueAtIndex = array[index];

  return valueAtIndex;
});

handlebars.registerHelper('isBetweenValues', (value, lowerBound, upperBound, options) => {
  if (upperBound === lowerBound) {
    if (parseInt(value) >= upperBound) {
      return options.fn(this);
    }
  }

  if (parseInt(value) >= lowerBound && parseInt(value) < upperBound) {
    return options.fn(this);
  }
});

handlebars.registerHelper('orCondition', (value1, value2) => {
  return !!value1 || !!value2;
});

module.exports = handlebars;
