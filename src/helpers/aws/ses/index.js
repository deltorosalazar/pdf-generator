const AWS = require('aws-sdk');
const nodemailer = require('nodemailer');

// dev

async function sendMail(base64, email) {
  try {
    const SESConfig = {
      apiVersion: '2010-12-01',
      accessKeyId: process.env.AWS_SECRET_ID,
      accessSecretKey: process.env.AWS_SECRET_KEY,
      region: 'us-east-2'
    };
    const transporter = nodemailer.createTransport({
      SES: new AWS.SES(SESConfig)
    });
    const text = 'Adjunto encontrará el reporte consolidado.';
    // Send mail with defined transport object
    const info = await transporter.sendMail({
      from: '"Auxiliar Maika" <auxiliar@docmaika.com>',
      to: email,
      subject: 'Reporte consolidado',
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
