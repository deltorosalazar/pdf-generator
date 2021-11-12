/* eslint-disable no-console */
class Logger {
  static log(message) {
    if (process.env === 'production') {
      return;
    }

    console.log(message);
  }
}

module.exports = Logger;
