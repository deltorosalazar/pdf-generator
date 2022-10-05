const {
  GoogleSpreadsheet,
  GoogleSpreadsheetRow,
  GoogleSpreadsheetWorksheet
} = require('google-spreadsheet');
const {
  GLOBAL_ENV_VARIABLES,
  GOOGLE_API_PERMISSIONS,
  GOOGLE_API_QUOTA_EXCEEDED,
  MAIKA_EMPTY_FORM,
  MAIKA_RECORD_NOT_FOUND
} = require('../../shared/constants/error_codes');
const MaikaError = require('../../shared/MaikaError');

/**
 *
 * @param {*} forms
 * @param {*} language
 */
const getFormsByLanguage = (forms, language) => {
  return forms.map((form) => {
    return form['id'][language];
  });
};

/**
 *
 * @param {GoogleSpreadsheetWorksheet} sheet
 * @param {GoogleSpreadsheetRow[]} rows
 * @param {string} field
 * @param {string} value
 */
const getRowsByField = async (sheet, rows, field, value) => {
  const { headerValues } = sheet;

  if (!headerValues.includes(field)) {
    throw new MaikaError(
      400,
      'Ninguna columna coincide con el ID',
      MAIKA_RECORD_NOT_FOUND,
      {
        received: field,
        expected: headerValues
      }
    );
  }

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

  // Gets the latest record, which means the last form was filled to that user.
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
 * @param {string} uniqueIDKey
 * @param {string} patientID
 * @returns
 */
const readSheet = async (sheetID, uniqueIDKey, patientID) => {
  console.log({ sheetID, uniqueIDKey, patientID });
  let spreadsheet = null;

  try {
    spreadsheet = new GoogleSpreadsheet(sheetID);
  } catch (error) {
    throw new MaikaError(
      error.response.status,
      'No tienes permisos para ver esta Hoja de Cálculo.',
      GOOGLE_API_PERMISSIONS,
      {
        received: sheetID
      }
    );
  }

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
    uniqueIDKey,
    patientID
  );
};

/**
 * Reads all the required sheets based on the selected report.
 *
 * @param {string} language
 * @param {string} patientID
 * @param {Object} reportToGenerate
 * @returns
 */
const readSheets = async (language, patientID, reportToGenerate) => {
  const parsedID = patientID.toString();
  const reportForms = reportToGenerate.forms;
  const uniqueIDKey = language === 'es'
    ? 'Documento de Identidad Paciente'
    : "Patient's Cellphone";

  if (!reportForms.length) {
    return [];
  }

  console.log({ reportForms });

  const formsID = getFormsByLanguage(reportForms, language);

  const formsResults = await Promise.all(
    formsID.map((sheetID) => {
      return readSheet(sheetID, uniqueIDKey, parsedID);
    })
  );

  const results = formsResults.reduce((accumulatedResults, formResult, index) => {
    return {
      ...accumulatedResults,
      [formsID[index]]: formResult
    };
  }, {});

  return results;
};

const readFullSheet = async (sheetID) => {
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

  return {
    sheet,
    rows
  };
};

module.exports = { readSheets, readFullSheet };
