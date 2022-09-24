const { GoogleSpreadsheet } = require('google-spreadsheet');
const {
  GLOBAL_ENV_VARIABLES,
  GOOGLE_API_QUOTA_EXCEEDED,
  MAIKA_EMPTY_FORM
} = require('../../shared/constants/error_codes');
const MaikaError = require('../../shared/MaikaError');
const { updateRecord } = require('../../helpers/faunadb')
const { EMAIL_STATUS } = require('../../shared/constants');

const { FirestoreService, getListOfFilesWithErrors } = require('../FirestoreService')

const readFromFirestore = async (collection, patientID) => {
  const firestoreService = new FirestoreService()
  const record = firestoreService.getOne(collection, patientID);

  return record;
}

/**
 * Reads all the required sheet based on the report.
 * @param {string} patientID
 * @param {Object} reportToGenerate
 * @returns
 */
const readSheetsFromFirestore = async (patientID, reportToGenerate) => {
  const parsedID = patientID.toString();

  if (!reportToGenerate.forms) {
    return [];
  }

  const reportForms = Object.keys(reportToGenerate.forms);

  const formsResults = await Promise.all(
    reportForms.map((form) => {
      return readFromFirestore(form, parsedID);
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

  const documentsMissing = getListOfFilesWithErrors(results)
  if (documentsMissing.length > 0) {
    await updateRecord(
      patientID, EMAIL_STATUS.FAILED, { error: { documentsMissing } }
    )
    return { stopProcess: true }
  }

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
  }
};

module.exports = { readSheetsFromFirestore, readFullSheet };
