
const AWS = require('aws-sdk');
// Set the region  
AWS.config.update({region: 'eu-west-1'});
//
const s3 = new AWS.S3();

const reply = (statusCode, body) => {
    return {
        statusCode,
        body: JSON.stringify(body),
        headers: { 'access-control-allow-origin': '*' },
    }
}
exports.get_signed_url = async (event, context) => {
    const body = JSON.parse(event.body);
    console.log('Request signed url', body);
    if (!body.method) return reply(400,  {
        message: 'Missing Method'
    });
    if (!body.filename) return reply(400,  {
        message: 'Missing Filename'
    });
    const params = { Bucket: process.env.UPLOAD_BUCKET, Key: `${body.filename}` };
    params.Expires = 3600;
    return reply(200, {
        url: s3.getSignedUrl(body.method, params)
    }); 
}
