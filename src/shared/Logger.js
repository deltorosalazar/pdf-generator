/* eslint-disable no-console */
class Logger {
  static log(message) {
    // if (process.env === 'development') {
    //   return;
    // }
    console.log(message);
    console.log('');
  }
}

module.exports = Logger;
