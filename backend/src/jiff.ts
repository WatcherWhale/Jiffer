import express from 'express';
import { Bucket } from './helpers/bucket';
import { Database } from './helpers/database';
import { Config } from './helpers/config';

const router = express.Router();
const bucket = new Bucket(Config.buckets.gifs.name, Config.buckets.gifs.region);
const db = new Database();


router.get("/:uuid", async (req, res) => {

    let param = req.params["uuid"];
    if(param.indexOf(".gif") !== -1)
    {
        param = param.substring(0, param.length - 4);
        console.log(param)
    }


    db.GetGif(param).then(async (gif) => {

        // Does the gif exist in the database
        if(!gif)
        {
            res.status(404).send();
            return;
        }

        // Is the gif still processing
        if(gif.processing)
        {
            res.status(404).send();
            return;
        }

        // Get the gif from the S3 bucket
        const file = await bucket.getFile(gif.path);

        // Check if the file exists in the bucket
        if(!file)
        {
            res.status(404).send();
            return;
        }

        // Send the file
        res.contentType("image/gif").send(file);
    })
    .catch((err) => {
        console.log(err)
        res.status(500).send();
    })
});

export { router as JIFFRouter }
