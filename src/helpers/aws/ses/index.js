const nodemailer = require('nodemailer');
const AWS = require('aws-sdk');

// dev

async function sendMail(base64, email, id) {
  try {
    const SES_CONFIG = {
      apiVersion: '2010-12-01',
      region: 'us-east-1'
    };

    await AWS.config.update(SES_CONFIG);

    const transporter = nodemailer.createTransport({
      SES: new AWS.SES()
    });
    const text = `ID:${id} - Adjunto encontrara el reporte consolidado.`;
    // send mail with defined transport object
    const info = await transporter.sendMail({
      from: 'auxiliar@docmaika.com',
      to: email,
      subject: `Reporte consolidado - ${id}`,
      text,
      html: `<div>${text}</div>`,
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

module.exports = sendMail;
