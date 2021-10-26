import fs from 'fs';
import express from 'express';
import {UploadedFile} from 'express-fileupload';
import {Bucket} from './helpers/bucket';
import { Database } from './helpers/database';
import { generateGif } from './helpers/gif';
import {downloadFiles, removeFilesSync} from './helpers/files';

const config = require('../config.json');

const router = express.Router();
const bucket = new Bucket(config.bucket.name, config.bucket.region);
const db = new Database();

router.post("/create", async (req, res) => {

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

    const featured = req.body.featured && req.body.featured == "true";

    // Save uploaded files
    const files = await downloadFiles(req.files.files as UploadedFile[]);

    // Generate GIF
    generateGif(files, req.body.delay || 100).then((gif) =>
    {
        // Upload GIF to s3
        bucket.uploadFile(gif.path, gif.id + ".gif", featured).then(() =>
        {
            db.RegisterGif(gif.id, gif.path).then(() =>
            {
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
        removeFilesSync(files);
    })
});

export { router as APIRouter }
