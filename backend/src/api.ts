import fs from 'fs';
import express from 'express';
import {UploadedFile} from 'express-fileupload';
import {Bucket} from './bucket';
import { generateGif } from './gif';
import {downloadFiles, removeFilesSync} from './files';

const config = require('../config.json');

const router = express.Router();
const bucket = new Bucket(config.bucket.name, config.bucket.region);

router.post("/create", async (req, res) => {

    // TODO: Check authentication

    // Check if there a re files attached
    if(!req.files)
    {
        res.contentType("application/json")
            .status(415)
            .send({"status": 415, "message": "There are no files attached."})
        return;
    }

    // Save uploaded files
    const fileArr = await downloadFiles(req.files.files as UploadedFile[]);

    // Generate GIF
    generateGif(fileArr, req.body.delay || 100).then((gif) =>
    {
        // Upload GIF to s3
        bucket.uploadFile(gif.path, gif.id + ".gif").then(() =>
        {
            // TODO: Register in database

            // Send OK message
            res.contentType("application/json")
                .send({"status": 200});
        })
        .catch((err) =>
        {
            res.status(500).contentType("application/json")
                .send({
                    "status": 500,
                    "message": "Failed to process gif."
                });

        })
        .finally(() =>
        {
            // Always remove the generated GIF
            fs.rmSync(gif.path);
        });

    })
    .catch((err) =>
    {
        res.status(500).contentType("application/json")
            .send({
                "status": 500,
                "message": "Failed to generate a gif."
            });
    })
    .finally(() => {
        removeFilesSync(fileArr);
    })
});

export { router as APIRouter }
