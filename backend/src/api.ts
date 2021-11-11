import express from 'express';
import { UploadedFile } from 'express-fileupload';
import { Bucket } from './helpers/bucket';
import { Database } from './helpers/database';
import { getFiles } from './helpers/files';
import { v4 as uuid } from 'uuid';
import { Config } from './helpers/config';

const router = express.Router();
const bucket = new Bucket(Config.bucket.name, Config.bucket.region);
const db = new Database();

router.get("/pictures/:id", async (req, res) => {
    db.GetGif(req.params["id"]).then(async (gif) => {

        // Does the gif exist in the database
        if(!gif)
        {
            res.status(404).send({status: 404, message: "Image expired or not found."});
            return;
        }

        // Is the gif still processing
        if(gif.processing)
        {
            res.status(404).send({status: 404, message: "Image is still processing."});
            return;
        }

        // Get the gif from the S3 bucket
        const file = await bucket.getFile(gif.file);

        // Check if the file exists in the bucket
        if(!file)
        {
            res.status(404).send({status: 404, message: "Image file is not found."});
            return;
        }

        // Send the file
        res.contentType("image/gif").send(file);
    })
    .catch(() => {
        res.status(500).send({status: 500});
    })
});

router.post("/pictures", async (req, res) => {

    // Check if the user is authenticated
    if(!req.authenticated)
    {
        res.contentType("application/json")
            .status(401)
            .send({"status": 401});
    }

    // Check if there are files attached
    if(!req.files)
    {
        res.contentType("application/json")
            .status(415)
            .send({"status": 415, "message": "There are no files attached."})
        return;
    }

    // Create a unique GIF id
    const id = uuid();

    // Save uploaded files to s3
    const files = getFiles(req.files.files as UploadedFile[]);

    // Create json data
    const jsonObj = {
        key: id,
        files: files.map(x => x.fileName),
        delay: req.body.delay,
        quality: req.body.quality
    }

    // Add json file
    files.push({
        fileName: id + ".json",
        data: Buffer.from(JSON.stringify(jsonObj), 'utf-8')
    });

    // Uplaod all files
    bucket.uploadFiles(id, files).then(() => {
        res.contentType("application/json")
            .send({
                "status": 200,
                "message": "Started processing files.",
                "id": id
            });
    })
    .catch((err) => {
        res.status(500).contentType("application/json")
            .send({
                "status": 500,
                "message": "Failed to process files."
        });
    });
});

export { router as APIRouter }
