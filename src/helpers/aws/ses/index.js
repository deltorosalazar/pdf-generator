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
    const text = `<img style="margin-bottom: 32px;" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAABEwAAAD+BAMAAADSYo3kAAAABGdBTUEAALGPC/xhBQAAAAFzUkdCAK7OHOkAAAAnUExURf9nAf5hC/9qAPxfEP9kB/9oBfz49/93KP+MTv+mdv7Wv/zq3/+/m6HxKwYAACAASURBVHja7F3Pj9vGFebqB9KjBkNhr8IChq4aiISvJijdtaaITf4BA60v3nUMx0APvRRJ3VzzA0nPQe3mbCBxzonb9I/q+zFDDqUhRVKUtF53dqXlStz1AvPle9/73nsT7+L4a+I1W72Leyku97tpca2cr1rvdLfWC9dKqxf8FeZOb7DYtSKxsRaiqyXn5e/N59lNvLz3AyZeA5ikJ4XJugFMdqJkCxSRKn67B0rgw7UUrvlc6nVXYQIvrNww6Rol6b5sMmgOE7P8DthE7YaJ0ChR7xFMVnVhAo/hiWCyXC4PCpOo+HU" />
    <p>Gracias por diligenciar los formularios MAIKA de salud física y psico social acorde con los lineamientos establecidos.</p>
    <p>Anexo encontrarás el resultado de tu cociente de bienestar y las gráficas de tu valoración.</p>
    <p>Ten en cuenta tus resultados para establecer metas  de bienestar para el próximo año entendiendo el bienestar de forma integral y la salud de forma preventiva.</p> 
    <br/>
    <p>MAIKA <br/> Entiende tu Salud!</p>`;

    const subjectMessage = `Resultado cociente de bienestar Maika`;

    const subject = process.env.NODE_ENV === 'production' ? subjectMessage : `${subjectMessage} - ${id}`;
    // send mail with defined transport object
    const info = await transporter.sendMail({
      from: 'auxiliar@docmaika.com',
      to: email,
      subject,
      text,
      html: `<div>${text}</div>`,
      attachments: [{
        filename: 'ReporteMaika.pdf',
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
