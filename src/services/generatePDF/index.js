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
const generatePdf = (reportToGenerate, results, saveToS3 = false) => {
  const { template } = reportToGenerate;

  const options = {
    pageSize: 'letter'
    // orientation: reportToGenerate.orientation || 'portrait'
  };

  const htmlCode = fs.readFileSync(`./src/templates/${template}`, 'utf8');

  try {
    const compiledTemplate = handlebars.compile(htmlCode);
    const formsKeys = [...Object.keys(FORMS), ...Object.keys(COMPUTED_FORMS)];

    console.log('=====================');
    console.log('=====================');
    console.log(Object.keys(formsKeys.reduce((formResults, formKey) => {
      const formID = FORMS[formKey] ? FORMS[formKey] : COMPUTED_FORMS[formKey];

      return {
        ...formResults,
        [formKey]: formResults[formID]
      };
    }, results)));

    const resultHtml = compiledTemplate({
      title: reportToGenerate.title,
      // supportImages: reportToGenerate.supportImages.map((image, index) => {
      //   return require(`../../templates/assets/${image}`);
      // }),
      infography:
        reportToGenerate.infography
        && require(`../../templates/assets/${reportToGenerate.infography}`),
      forms: formsKeys.reduce((formResults, formKey) => {
        const formID = FORMS[formKey] ? FORMS[formKey] : COMPUTED_FORMS[formKey];

        console.log({ formKey, formID, table: formResults[formID] ? formResults[formID].table : [] });

        return {
          ...formResults,
          [formKey]: formResults[formID]
        };
      }, results)
      // chart: `data:image/jpg;base64,${results.chart}`,
      // recomendations: results.recomendations,
      // patientName: results.patientName,
      // date: results.date,
      // labels: results.labels,
      // wellnessQuotient: results.wellnessQuotient,
      // hero: require(`../../templates/assets/heroes/${reportToGenerate.hero}`),
      // infography:
      //   reportToGenerate.infography
      //   && require(`../../templates/assets/${reportToGenerate.infography}`),
      // percentages: results.percentages,
      // symptomsTable: results.symptomsTable,
      // // anexoMental: results.anexoMental,
      // ...otherCharts
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
    //     Bucket: process.env.PDF_BUCKET	,
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
