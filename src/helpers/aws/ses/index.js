
const nodemailer = require("nodemailer");
const AWS = require('aws-sdk')


//dev

async function sendMail(base64, email) {
  try {
    const SES_CONFIG = {
      apiVersion: "2010-12-01",
      region: "us-east-2",
    }

    await AWS.config.update(SES_CONFIG)

    let transporter = nodemailer.createTransport({
      SES: new AWS.SES()
    });
    let text = 'Adjunto encontrara el reporte consolidado.';
    // send mail with defined transport object
    let info = await transporter.sendMail({
      from: 'auxiliar@docmaika.com',
      to: email,
      subject: "Reporte consolidado",
      text: text,
      html: '<div>' + text + '</div>',
      attachments: [{
        filename: 'ReporteConsolidado.pdf',
        content: base64,
        encoding: 'base64'
      }]
    });
    return info;
  } catch (error) {
    return Promise.reject(error);
  }
}

module.exports = sendMail