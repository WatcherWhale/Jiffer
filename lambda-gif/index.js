const process = require('process');
const aws = require('aws-sdk');
const s3 = new aws.S3({ apiVersion: '2006-03-01' });
const fs = require('fs');

const path = require('path');
const {Readable} = require('stream');

const BIN_PATH = process.env['LAMBDA_TASK_ROOT'] + "/graphicsmagick/bin/";
const GM = require('gm').subClass({appPath: BIN_PATH});

console.log("Starting lambda...");
const createGif = async (event, context) => {
    return new Promise(async (resolve, reject) => {
        console.log("Lambda is running.")

        // Get info from which bucket and which file the trigger originated from
        const bucket = event.Records[0].s3.bucket.name;
        const key = decodeURIComponent(event.Records[0].s3.object.key.replace(/\+/g, ' '));

        let params =
        {
            Bucket: bucket,
            Key: key,
        };

        try
        {
            // Download the json file into memory
            const object = await s3.getObject(params).promise();
            const json = JSON.parse(object.Body.toString())
            console.log("Downloading json file")

            // Created a GraphicsMagick process
            let gif = GM();

            // Download files to temporary file system,
            //   and add pipe them to GraphicsMagick
            for(const i in json.files)
            {
                const file = json.files[i];
                params.Key = path.join(json.key, file);
                const object = await s3.getObject(params).promise();

                console.log("Downloaded " + file);

                const ext = path.extname(file);

                fs.writeFileSync("/tmp/" + i + ext, object.Body)
                gif = gif.in("/tmp/" + i + ext);
            }

            console.log("Downloaded files");

            // Set the GIF paramters
            gif = gif.delay(json.delay);
            gif = gif.quality(json.quality);

            // Write the gif to the temporary filesystem
            gif.write("/tmp/gif.gif", async (err) => {

                if(err)
                {
                    console.log(err);
                    reject(err);
                    return;
                }

                console.log("Created gif")

                // Create the bucket path for the gif
                const gifKey = path.join(json.key, json.key + ".gif");

                // Upload the gif to the bucket
                await s3.putObject({
                    Bucket: bucket,
                    Key: gifKey,
                    Body: fs.readFileSync("/tmp/gif.gif")
                }).promise();


                // Remove files from temporary filesystem
                for(const i in json.files)
                {
                    fs.rmSync("/tmp/" + i + ".png");
                }

                fs.rmSync("/tmp/gif.gif");

                // Resolve the lambda function, and return the bucket path of the gif
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

exports.handler = createGif;
