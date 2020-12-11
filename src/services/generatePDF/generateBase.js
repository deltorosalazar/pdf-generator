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

  const a = wkhtmltopdf(resultHtml, { pageSize: 'letter' });

  return new Promise(async (resolve, reject) => {
    toArray(a)
      .then(function (parts) {
        const buffers = parts.map((part) =>
          Buffer.isBuffer(part) ? part : Buffer.from(part)
        );

        let generatedBuffer = Buffer.concat(buffers);

        resolve(generatedBuffer.toString("base64"));
      })
      .catch(reject);
  })
};

module.exports = generateBase;
