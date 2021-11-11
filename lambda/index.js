const process = require('process');
const aws = require('aws-sdk');
const s3 = new aws.S3({ apiVersion: '2006-03-01' });
const fs = require('fs');

const path = require('path');
const {Readable} = require('stream');

const BIN_PATH = process.env['LAMBDA_TASK_ROOT'] + "/graphicsmagick/bin/";
const GM = require('gm').subClass({appPath: BIN_PATH});


aws.config.update({
    maxRetries: 2,
    httpOptions: {
        timeout: 30000,
        connectTimeout: 50000
    }
});

console.log("Starting lambda...");
const createGif = async (event, context) => {
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

                console.log("Downloaded " + file);

                fs.writeFileSync("/tmp/" + i + ".png", object.Body)
                gif = gif.in("/tmp/" + i + ".png");
            }

            console.log("Downloaded files");

            gif = gif.delay(json.delay);
            gif = gif.quality(json.quality);

            gif.write("/tmp/gif.gif", async (err) => {
                if(err)
                {
                    console.log(err);
                    reject(err);
                    return;
                }

                console.log("Created gif")

                const gifKey = path.join(json.key, json.key + ".gif");

                await s3.putObject({
                    Bucket: bucket,
                    Key: gifKey,
                    Body: fs.readFileSync("/tmp/gif.gif")
                }).promise();

                for(const i in json.files)
                {
                    fs.rmSync("/tmp/" + i + ".png");
                }

                fs.rmSync("/tmp/gif.gif");

                resolve(gifKey);

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

// https://gist.github.com/wpscholar/270005d42b860b1c33cf5ab25b37928a
function buffer2Stream(buff)
{
    return new Readable({
        read() {
            this.push(buff);
            this.push(null);
        }
    });
}

exports.handler = createGif;
