const process = require('process');
const aws = require('aws-sdk');
const s3 = new aws.S3({ apiVersion: '2006-03-01' });
const fs = require('fs');
const mysql = require('mysql');

const path = require('path');

const BIN_PATH = process.env['LAMBDA_TASK_ROOT'] + "/graphicsmagick/bin/";
const GM = require('gm').subClass({appPath: BIN_PATH});

console.log("Starting lambda...");

const createGif = (event, context) => {
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
            console.log("Downloading json file")
            const object = await s3.getObject(params).promise();
            const json = JSON.parse(object.Body.toString())

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


            const filters = Object.keys(json.filters);

            for(let i in filters)
            {
                const filter = filters[i];

                console.log(filter)

                if(filter in gif)
                {
                    gif[filter](...json.filters[filter]);
                }
            }

            // Set the GIF paramters
            //gif = gif.delay(json.delay);
            //gif = gif.quality(json.quality);

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

                //await updateDB(json.key);


                // Remove files from temporary filesystem
                for(const i in json.files)
                {
                    const ext = path.extname(json.files[i]);
                    fs.rmSync("/tmp/" + i + ext);
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

const updateDB = (uuid) => {
    return new Promise((resolve, reject) => {

        console.log("Updating database entry")
        const connection = mysql.createConnection({
            host: process.env['host'],
            user: process.env['user'],
            password: process.env['password'],
            database: process.env['database']
        });

        connection.query("UPDATE `gifs` SET `processing`='0' WHERE `uuid`=?", [uuid], (err, results, fields) => {
            if(err)
            {
                console.log(err);
                reject(err);
                return;
            }

            resolve();
        });
    });
}

exports.handler = createGif;
