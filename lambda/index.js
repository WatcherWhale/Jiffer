const aws = require('aws-sdk');
const s3 = new aws.S3({ apiVersion: '2006-03-01' });

const path = require('path');
const fs = require('fs');
const GM = require('gm');
const {resolve} = require('dns');

console.log("Starting lambda...");
exports.handler = async (event, context) => {
    return new Promise(async (resolve, reject) => {
        console.log("Lambda is running.")

        const bucket = event.Records[0].s3.bucket.name;
        const key = decodeURIComponent(event.Records[0].s3.object.key.replace(/\+/g, ' '));

        let params =
        {
            Bucket: bucket,
            Key: key,
        };

        try
        {
            const object = await s3.getObject(params).promise();
            const json = JSON.parse(object.Body.toString())
            console.log("Downloading json file")

            let gif = GM();

            for(const i in json.files)
            {
                const file = json.files[i];
                params.Key = path.join(json.key, file);
                const object = await s3.getObject(params).promise();

                gif = gif.in(object.Body, i + ".png");
            }

            console.log("Downloaded files");

            gif = gif.delay(json.delay);
            gif.toBuffer(async (err, buffer) => {
                console.log("created gif")
                if(err)
                {
                    console.log(err);
                    reject(err);
                    return;
                }

                await s3.putObject({
                    Bucket: bucket,
                    Key: path.join(json.key, json.key + ".gif"),
                    Body: buffer
                }).promise();

                resolve(buffer);

                console.log("Created gif successfully");

            });
        }
        catch (err)
        {
            console.log(err);
            reject(err);
        }
    });
}
