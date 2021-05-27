const { GoogleSpreadsheet } = require("google-spreadsheet");
const {
  GLOBAL_ENV_VARIABLES,
  GOOGLE_API_QUOTA_EXCEEDED,
  MAIKA_RECORD_NOT_FOUND
} = require("../../shared/constants/error_codes");
const MaikaError = require("../../shared/MaikaError");

const init = async (patientID, reportToGenerate) => {
  const parsedID = patientID.toString();

  const formNames = await Promise.all(
    reportToGenerate.forms.map((form) => {
      return readSheet(form, parsedID);
    })
  ).catch(function (err) {
    return Promise.reject(err)
  });

  return formNames;
};

const readSheet = async (formID, patientID) => {
  const spreadsheet = new GoogleSpreadsheet(formID);

  const {
    GOOGLE_SERVICE_ACCOUNT_EMAIL,
    GOOGLE_PRIVATE_KEY
  } = process.env

  if (!GOOGLE_SERVICE_ACCOUNT_EMAIL || !GOOGLE_PRIVATE_KEY) {
    throw new MaikaError(
      400,
      `
        Alguna de las variables de entorno no ha sido definida.
        GOOGLE_SERVICE_ACCOUNT_EMAIL=${GOOGLE_SERVICE_ACCOUNT_EMAIL ? 'defined' : 'undefined'}
        GOOGLE_PRIVATE_KEY=${GOOGLE_PRIVATE_KEY ? 'defined' : 'undefined'}
      `,
      GLOBAL_ENV_VARIABLES,
      null
    );
  }

  await spreadsheet.useServiceAccountAuth({
    client_email: GOOGLE_SERVICE_ACCOUNT_EMAIL,
    private_key: GOOGLE_PRIVATE_KEY.replace(/\\n/g, "\n"),
  });

  await spreadsheet.loadInfo();

  const sheet = spreadsheet.sheetsByIndex[0];

  let rows = []

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
      `No hay registros en el formulario ${formID}`,
      MAIKA_EMPTY_FORM,
      {
        received: formID,
        expected: null
      }
    );
  }

  return await getRowsByField(
    sheet,
    rows,
    "Documento de Identidad Paciente",
    patientID
  );
};

/**
 *
 * @param {*} sheet
 * @param {*} rows
 * @param {*} field
 * @param {*} value
 */
const getRowsByField = async (sheet, rows, field, value) => {
  const { headerValues } = sheet;
  const records = rows.filter(
    (row) => row[field].toString() === value.toString()
  );

  if (!records.length) {
    throw new MaikaError(
      404,
      `No se encontró un registro con ID ${value}`,
      MAIKA_RECORD_NOT_FOUND,
      {
        received: value,
        expected: null
      }
    )
  }

  const lastRecord = records.pop();
  let parsedRecord = {};

  headerValues.forEach((header) => {
    parsedRecord[header] = lastRecord[header];
  });

  return parsedRecord;
};

module.exports = init;
