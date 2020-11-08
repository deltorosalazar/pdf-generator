const { GoogleSpreadsheet } = require("google-spreadsheet");

const init = async (patientID, reportToGenerate) => {
  const parsedID = patientID.toString();

  const formNames = await Promise.all(
    reportToGenerate.forms.map((form) => {
      return readSheet(form, parsedID);
    })
  ).catch(function (err) {
    console.log("A promise failed to resolve", err);
    return new Error(err.message);
  });

  return formNames;
};

const readSheet = async (formID, patientID) => {
  try {
    const spreadsheet = new GoogleSpreadsheet(formID);

    await spreadsheet.useServiceAccountAuth({
      client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
      private_key: process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, "\n"),
    });

    await spreadsheet.loadInfo();

    const sheet = spreadsheet.sheetsByIndex[0];
    const rows = await sheet.getRows();

    if (!rows.length) {
      // Improve the way the errors are being handled. 👀
      throw new Error(`No hay registros en el formulario ${formID}`);
    }

    return getRowsByField(
      sheet,
      rows,
      "Documento de Identidad Paciente",
      patientID
    );
  } catch (e) {
    // Improve the way the errors are being handled. 👀
    throw new Error(e.message, `No hay registros en el formulario ${formID}`);
  }
};

/**
 *
 * @param {*} sheet
 * @param {*} rows
 * @param {*} field
 * @param {*} value
 */
const getRowsByField = (sheet, rows, field, value) => {
  const { headerValues } = sheet;
  const records = rows.filter(
    (row) => row[field].toString() === value.toString()
  );

  if (!records.length) {
    throw new Error(`No se encontro un registro con ese ID ${value}`);
  }

  const lastRecord = records.pop();
  let parsedRecord = {};

  headerValues.forEach((header) => {
    parsedRecord[header] = lastRecord[header];
  });

  return parsedRecord;
};

module.exports = init;
