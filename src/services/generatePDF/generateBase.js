const fs = require("fs");
const handlebars = require("./../../helpers/handlebars");
const wkhtmltopdf = require("../../helpers/pdf/wkhtmltopdf");
const toArray = require("stream-to-array");

/**
 *
 * @param {*} chart
 * @param {*} reportToGenerate
 * @param {*} results
 * @param {*} otherCharts
 */
const generateBase = (
  chart,
  reportToGenerate,
  results,
  otherCharts,
  saveToS3
) => {
  const { template } = reportToGenerate;

  const options = {
    pageSize: "letter",
  };

  const htmlCode = fs.readFileSync(`./src/templates/${template}`, "utf8");

  const compiledTemplate = handlebars.compile(htmlCode);

  const resultHtml = compiledTemplate({
    chart: `data:image/jpg;base64,${chart}`,
    title: reportToGenerate.title,
    recomendations: results.recomendations,
    patientName: results.patientName,
    date: results.date,
    labels: results.labels,
    wellnessQuotient: results.wellnessQuotient,
    hero: require(`../../templates/assets/heroes/${reportToGenerate.hero}`),
    infography:
      reportToGenerate.infography &&
      require(`../../templates/assets/${reportToGenerate.infography}`),
    percentages: results.percentages,
    ...otherCharts,
  });

  // For debugging purposes.
  // wkhtmltopdf(resultHtml, options)
  //     .pipe(fs.createWriteStream(`${Date.now()}.pdf`))

  return new Promise(async (resolve, reject) => {
    await wkhtmltopdf(resultHtml, options, function (error, stream) {
      if (error) return reject(error);

      return toArray(stream)
        .then(function (parts) {
          const buffers = parts.map((part) =>
            Buffer.isBuffer(part) ? part : Buffer.from(part)
          );

          let generatedBuffer = Buffer.concat(buffers);
          resolve(generatedBuffer.toString("base64"));
        })
        .catch(reject);
    });
  });

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
  //resolve("generated pdf");
  // });
};

module.exports = generateBase;
