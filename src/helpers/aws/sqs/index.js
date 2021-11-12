const AWS = require('aws-sdk')

//dev
const createSqsClient = () => {
    return new AWS.SQS({
        apiVersion: '2012-11-05',
        region: "us-east-1",
    });
};

module.exports = createSqsClient