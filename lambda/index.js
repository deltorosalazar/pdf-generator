const axios = require('axios');

function request(url, messageBody) {
    return new Promise((resolve, reject) => {
        axios({
            method: 'post',
            url,
            data: JSON.parse(messageBody)
        }).then(function (response) {
            resolve(response)
        }).catch(function (error) {
            reject(error)
        });
    });
}

exports.lambdaHandler = async (event) => {
    let { API_URL } = process.env;

    try {
        await Promise.all(
            event.Records.map(({ body }) => request(API_URL, body))
        );
        console.log(event);
        return event;
    } catch (err) {
        console.log(err);
        throw err;
    }
};