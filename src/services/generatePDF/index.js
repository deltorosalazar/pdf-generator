/* eslint-disable max-len */
const fs = require('fs');
const toArray = require('stream-to-array');
const handlebars = require('../../helpers/handlebars');
const wkhtmltopdf = require('../../helpers/pdf/wkhtmltopdf');
const S3 = require('../../helpers/aws/s3');
const { FORMS, COMPUTED_FORMS } = require('../../shared/constants');
const path = require('path');
const Logger = require('../../shared/Logger');

const generatePdf = (language, reportToGenerate, results, generateBase64 = false, saveToS3 = false) => {
  const template = reportToGenerate['template'][language];
  const options = {
    pageSize: 'letter',
    orientation: reportToGenerate.orientation || 'portrait'
  };

  // console.log(Object.keys(FORMS));

  const htmlCode = fs.readFileSync(`./src/templates/${template}`, 'utf8');

  // Partials
  const footer = fs.readFileSync('./src/templates/partials/footer.handlebars', 'utf8');

  try {
    handlebars.registerPartial('footer', footer);
    const compiledTemplate = handlebars.compile(htmlCode);
    const formsKeys = [...Object.keys(FORMS), ...Object.keys(COMPUTED_FORMS)];

    // Logger.log({
    //   formsKeys,
    //   results
    // });

    // console.log('=-=-=-=-==-=-=-==');
    // console.log(formsKeys.reduce((formResults, formKey) => {
    //   const formID = FORMS[formKey] ? FORMS[formKey]['forms'][language] : COMPUTED_FORMS[formKey][language];

    //   if (formID) {
    //     console.log({ formID });
    //   }
    //   return {
    //     ...formResults,
    //     [formKey]: formResults[formID]
    //   };
    // }, results));


    const a = formsKeys.reduce((formResults, formKey) => {
      const formID = FORMS[formKey] ? FORMS[formKey]['forms'][language] : COMPUTED_FORMS[formKey]['forms'];

      // console.log({ formID });

      return {
        ...formResults,
        [formKey]: formResults[formID]
      };
    }, results);

    // const b = formsKeys.reduce((formResults, formKey) => {
    //   const formID = FORMS[formKey] ? FORMS[formKey]['forms'][language] : COMPUTED_FORMS[formKey]['forms'];

    //   return {
    //     ...formResults,
    //     [formKey]: formID
    //   };
    // }, {});

    console.log({ a });

    const currentDir = path.join(__dirname, '../../');


    // fs.writeFile(`report.json`, JSON.stringify(a, null, 2), (err) => {
    //   if (err) {
    //     console.error(err);
    //   }
    //   // file written successfully
    // });


    const resultHtml = compiledTemplate({
      currentDir,
      language,
      title: reportToGenerate.title,
      infography:
        reportToGenerate.infography && require(`../../templates/assets/${reportToGenerate.infography}`),
      forms: a
    });

    // console.log(formsKeys.reduce((formResults, formKey) => {
    //   const formID = FORMS[formKey] ? FORMS[formKey]['forms'][language] : COMPUTED_FORMS[formKey][language];

    //   // console.log({ formID });

    //   return {
    //     ...formResults,
    //     [formKey]: formResults[formID]
    //   };
    // }, results));

    // For debugging purposes.
    // wkhtmltopdf(resultHtml, options)
    //   .pipe(fs.createWriteStream(`${Date.now()}.pdf`))

    // if (saveToS3) {
    //   wkhtmltopdf(resultHtml, options, (error, stream) => {
    //     if (error) return reject(error);

    //     return toArray(stream)
    //       .then((parts) => {
    //         const buffers = parts.map((part) => (Buffer.isBuffer(part) ? part : Buffer.from(part)));

    //         const generatedBuffer = Buffer.concat(buffers);

    //         resolve(generatedBuffer);
    //       })
    //       .catch(reject);
    //   });
    // }

    const stream = wkhtmltopdf(resultHtml, options);

    if (generateBase64) {
      return new Promise((resolve, reject) => {
        toArray(stream)
          .then((parts) => {
            const buffers = parts.map((part) => {
              return Buffer.isBuffer(part) ? part : Buffer.from(part);
            });

            const generatedBuffer = Buffer.concat(buffers);

            resolve(generatedBuffer.toString('base64'));
          })
          .catch(reject);
      });
    }

    return Promise.resolve(stream);

    // return new Promise(async (resolve, reject) => {
    // var stream = wkhtmltopdf(fs.createReadStream('test.pdf'))

    // console.log(stream);

    // .pipe(fs.createWriteStream(`${Date.now()}.pdf`))

    // wkhtmltopdf(resultHtml, options, function (error, stream) {
    //   if (error) return reject(error)

    //   console.log(stream);

    // return toArray(stream)
    //   .then(function (parts) {
    //     const buffers = parts.map((part) =>
    //       Buffer.isBuffer(part) ? part : Buffer.from(part)
    //     );
    //     let generatedBuffer = Buffer.concat(buffers);

    //     resolve(generatedBuffer)
    //   })
    //   .catch(reject)
    // });

    // await S3.getInstance()
    //   .putObject({
    //     Body: stream,
    //     Bucket: process.env.PDF_BUCKET,
    //     ACL: "private",
    //     ContentType: "application/pdf",
    //     Key: key,
    //     ContentDisposition: "attachment",
    //   })
    //   .promise()

    // return S3.getInstance().getSignedUrl("getObject", {
    //   Bucket: config.s3.upload,
    //   Key: key,
    //   Expires: 900,
    // });

    // resolve()
    // resolve("generated pdf");
    // });
  } catch (error) {
    console.log({ error });
  }
};

module.exports = generatePdf;
