const handlebars = require('handlebars');

handlebars.registerHelper('setColor', (value, badBound, mediumBound, goodBound) => {
  console.log({ value, badBound, mediumBound, goodBound });
  if (parseInt(value) >= badBound && parseInt(value) <= mediumBound) {
    return 'red';
  } if (parseInt(value) > mediumBound && parseInt(value) <= goodBound) {
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
    if (parseInt(value) + 1 === upperBound + 1) {
      return options.fn(this);
    }
  }

  if (parseInt(value) > lowerBound && parseInt(value) <= upperBound) {
    return options.fn(this);
  }
});

handlebars.registerHelper('orCondition', (value1, value2, options) => {
  return !!value1 || !!value2;
});

module.exports = handlebars;
