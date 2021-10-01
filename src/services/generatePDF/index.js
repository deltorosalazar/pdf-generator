/* eslint-disable max-len */
const fs = require('fs');
const toArray = require('stream-to-array');
const handlebars = require('../../helpers/handlebars');
const wkhtmltopdf = require('../../helpers/pdf/wkhtmltopdf');
const S3 = require('../../helpers/aws/s3');
const { FORMS, COMPUTED_FORMS } = require('../../shared/constants');

/**
 *
 * @param {*} chart
 * @param {*} reportToGenerate
 * @param {*} results
 * @param {*} otherCharts
 */
const generatePdf = (reportToGenerate, results, generateBase64 = false, saveToS3 = false) => {
  const { template } = reportToGenerate;

  const options = {
    pageSize: 'letter',
    orientation: reportToGenerate.orientation || 'portrait',
    marginBottom: '.25mm',
    marginTop: '0mm',
    marginLeft: '.5mm',
    marginRight: '.5mm'
  };

  const htmlCode = fs.readFileSync(`./src/templates/${template}`, 'utf8');

  try {
    const compiledTemplate = handlebars.compile(htmlCode);
    const formsKeys = [...Object.keys(FORMS), ...Object.keys(COMPUTED_FORMS)];
    const resultHtml = compiledTemplate({
      title: reportToGenerate.title,
      infography:
        reportToGenerate.infography
        && require(`../../templates/assets/${reportToGenerate.infography}`),
      forms: formsKeys.reduce((formResults, formKey) => {
        const formID = FORMS[formKey] ? FORMS[formKey] : COMPUTED_FORMS[formKey];

        return {
          ...formResults,
          [formKey]: formResults[formID]
        };
      }, results)
    });

    // For debugging purposes.
    // wkhtmltopdf(resultHtml, options)
    //     .pipe(fs.createWriteStream(`${Date.now()}.pdf`))

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
