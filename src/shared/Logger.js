/* eslint-disable no-console */
class Logger {
  static log(message) {
    if (process.env.NODE_ENV === 'production') {
      return;
    }

    console.log(message);
  }
}

module.exports = Logger;
