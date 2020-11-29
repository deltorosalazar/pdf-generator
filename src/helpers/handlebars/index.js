const handlebars = require('handlebars')

handlebars.registerHelper('setColor', (value) => {
  if (value >= 0 && value <= 50) {
    return 'red'
  } else if (value > 50 && value <= 80) {
    return 'orange'
  } else {
    return 'green'
  }
})

module.exports = handlebars
