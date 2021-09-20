const { CLIENT_NO_PARAMS_REQUIRED } = require('../shared/constants/error_codes');
const MaikaError = require('../shared/MaikaError');

/**
 * Checks if all the required params were sent.
 * @param {Array<string>} requiredParams
 * @return {Function}
 */
const handler = (requiredParams) => {
  return (req, res, next) => {
    try {
      const { body } = req;
      const areParamsComplete = requiredParams.reduce((prev, currentParam) => {
        return prev && Object.keys(body).includes(currentParam);
      }, true);

      if (!areParamsComplete) {
        throw new MaikaError(
          400,
          `No se han enviado todos los parámetros necesarios [${requiredParams.join(', ')}].`,
          CLIENT_NO_PARAMS_REQUIRED,
          {
            received: Object.keys(body),
            expected: requiredParams
          }
        );
      }

      return next();
    } catch (error) {
      return res.status(error.httpStatusCode).json({
        timestamp: Date.now(),
        status: error.httpStatusCode,
        messages: [
          error.message
        ],
        data: error.data
      });
    }
  };
};

module.exports = {
  handler
};
