const wkhtmltopdf = require('wkhtmltopdf')

wkhtmltopdf.command = `${process.cwd()}/wkhtmltox/bin/wkhtmltopdf --enable-local-file-access`
module.exports = wkhtmltopdf
