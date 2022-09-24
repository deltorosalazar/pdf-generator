const aws = require('aws-sdk');

const s3 = new aws.S3();

class S3 {
  static getInstance() {
    return s3;
  }
}

module.exports = S3;
