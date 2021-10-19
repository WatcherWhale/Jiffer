import fs from 'fs';
import path from 'path';
import express from 'express';
import ConvertAPI from "convertapi";
import {UploadedFile} from 'express-fileupload';
import {Bucket} from './bucket';

import { v4 as uuid } from 'uuid';

const config = require('../config.json');

const router = express.Router();
const convertapi = new ConvertAPI(config["convert-key"]);

const bucket = new Bucket(config.bucket.name, config.bucket.region);

router.post("/create", async (req, res) => {

    // Check if there a re files attached
    if(!req.files)
    {
        res.contentType("application/json")
            .status(415)
            .send({"status": 415, "message": "There are no files attached."})
        return;
    }

    // Create the temp folder if it doesn't exists
    if(!fs.existsSync("./temp"))
    {
        fs.mkdirSync("./temp");
    }


    // Save uploaded files
    const files = req.files.files as UploadedFile[];
    const fileArr = [];

    for(const i in files)
    {
        const file = path.join("./temp/", files[i].name);
        await files[i].mv(file);
        fileArr.push(file)
    }


    // Upload files to the GIF-api
    const result = await convertapi.convert("gif", {
        Files: fileArr,
        AnimationDelay: req.body.delay
    });

    // Save the gif
    const gifPath = path.join("./temp", req.body.name + ".gif")
    await result.saveFiles(gifPath);

    // Remove files
    for(const i in fileArr)
    {
        fs.rmSync(fileArr[i]);
    }

    // Upload file to bucket
    await bucket.uploadFile(gifPath, uuid() + ".gif");

    res.contentType("application/json")
        .send({"status": 200});
});

export { router as APIRouter }
