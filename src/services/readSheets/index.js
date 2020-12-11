const { GoogleSpreadsheet } = require("google-spreadsheet");
const {
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

  await spreadsheet.useServiceAccountAuth({
    client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
    private_key: process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, "\n"),
  });

  await spreadsheet.loadInfo();

  const sheet = spreadsheet.sheetsByIndex[0];

  let rows = []

  try {
    rows = await sheet.getRows();
  } catch (error) {
    throw new MaikaError({
      code: GOOGLE_API_QUOTA_EXCEEDED,
      message: 'Se han excedido el límite de consultas a los resultados. Por favor intente en 1 o 2 minutos.',
      data: null
    });
  }

  if (!rows.length) {
    throw new MaikaError({
      code: MAIKA_EMPTY_FORM,
      message: `No hay registros en el formulario ${formID}`,
      data: {
        received: formID,
        expected: null
      }
    });
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
    throw new MaikaError({
      code: MAIKA_RECORD_NOT_FOUND,
      message: `No se encontró un registro con ID ${value}`,
      data: {
        received: value,
        expected: null
      }
    })
  }

  const lastRecord = records.pop();
  let parsedRecord = {};

  headerValues.forEach((header) => {
    parsedRecord[header] = lastRecord[header];
  });

  return parsedRecord;
};

module.exports = init;
