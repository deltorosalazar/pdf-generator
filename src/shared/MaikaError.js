class MaikaError extends Error {
  constructor(httpStatusCode, message, code, data) {
    super();

    this.httpStatusCode = httpStatusCode;
    this.message = message;
    this.code = code;
    this.data = data;
  }
}

module.exports = MaikaError;
