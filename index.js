const serverless = require('serverless-http')
const { server } = require('./src/app')

server.on('app::started', port =>
  console.log(`App started and listening at ${port}`)
)

module.exports.handler = serverless(server)
