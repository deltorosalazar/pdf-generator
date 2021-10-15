const { GoogleSpreadsheet, GoogleSpreadsheetWorksheet } = require('google-spreadsheet');
const {
  GLOBAL_ENV_VARIABLES,
  GOOGLE_API_QUOTA_EXCEEDED,
  MAIKA_EMPTY_FORM,
  MAIKA_RECORD_NOT_FOUND
} = require('../../shared/constants/error_codes');
const MaikaError = require('../../shared/MaikaError');

/**
 *
 * @param {GoogleSpreadsheetWorksheet} sheet
 * @param {Array} rows
 * @param {string} field
 * @param {*} value
 */
const getRowsByField = async (sheet, rows, field, value) => {
  const { headerValues } = sheet;
  const records = rows.filter((row) => {
    return row[field].toString() === value.toString();
  });

  if (!records.length) {
    throw new MaikaError(
      404,
      `No se encontró un registro con ID ${value}`,
      MAIKA_RECORD_NOT_FOUND,
      {
        received: value,
        expected: null
      }
    );
  }

  // Gets the latest record, which means the last form wass filled to that user.
  const lastRecord = records.pop();
  const parsedRecord = {};

  headerValues.forEach((header) => {
    parsedRecord[header] = lastRecord[header];
  });

  return parsedRecord;
};

/**
 *
 * @param {string} sheetID
 * @param {string} patientID
 * @returns
 */
const readSheet = async (sheetID, patientID) => {
  const spreadsheet = new GoogleSpreadsheet(sheetID);

  const {
    GOOGLE_SERVICE_ACCOUNT_EMAIL,
    GOOGLE_PRIVATE_KEY
  } = process.env;

  if (!GOOGLE_SERVICE_ACCOUNT_EMAIL || !GOOGLE_PRIVATE_KEY) {
    throw new MaikaError(
      400,
      'Alguna de las variables de entorno no ha sido definida.',
      GLOBAL_ENV_VARIABLES,
      {
        received: {
          GOOGLE_SERVICE_ACCOUNT_EMAIL: !!GOOGLE_SERVICE_ACCOUNT_EMAIL,
          GOOGLE_PRIVATE_KEY: !!GOOGLE_PRIVATE_KEY
        },
        expected: ['GOOGLE_SERVICE_ACCOUNT_EMAIL', 'GOOGLE_PRIVATE_KEY']
      }
    );
  }

  await spreadsheet.useServiceAccountAuth({
    client_email: GOOGLE_SERVICE_ACCOUNT_EMAIL,
    private_key: GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n')
  });

  await spreadsheet.loadInfo();

  const sheet = spreadsheet.sheetsByIndex[0];

  let rows = [];

  try {
    rows = await sheet.getRows();
  } catch (error) {
    throw new MaikaError(
      429,
      'Se han excedido el límite de consultas a los resultados. Por favor intente en 1 o 2 minutos.',
      GOOGLE_API_QUOTA_EXCEEDED,
      null
    );
  }

  if (!rows.length) {
    throw new MaikaError(
      503,
      `No hay registros en el formulario (${sheetID})`,
      MAIKA_EMPTY_FORM,
      {
        received: sheetID,
        expected: null
      }
    );
  }

  return getRowsByField(
    sheet,
    rows,
    'Documento de Identidad Paciente',
    patientID
  );
};

/**
 * Reads all the required sheet based on the report.
 * @param {string} patientID
 * @param {Object} reportToGenerate
 * @returns
 */
const readSheets = async (patientID, reportToGenerate) => {
  const parsedID = patientID.toString();

  if (!reportToGenerate.forms) {
    return [];
  }

  const reportForms = Object.keys(reportToGenerate.forms);

  const formsResults = await Promise.all(
    reportForms.map((form) => {
      return readSheet(form, parsedID);
    })
  ).catch((err) => {
    return Promise.reject(err);
  });

  const results = formsResults.reduce((resultsObject, formResult, index) => {
    return {
      ...resultsObject,
      [reportForms[index]]: formResult
    };
  }, {});

  return results;
};

module.exports = readSheets;
