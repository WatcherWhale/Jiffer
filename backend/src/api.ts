import express from 'express';
import { UploadedFile } from 'express-fileupload';
import { Bucket } from './helpers/bucket';
import { Database } from './helpers/database';
import { getFiles } from './helpers/files';
import { v4 as uuidv4 } from 'uuid';
import { Config } from './helpers/config';

const router = express.Router();
const bucket = new Bucket(Config.buckets.gifs.name, Config.buckets.gifs.region);
const db = new Database();

router.get("/pictures/", async (req, res) => {

    // Only featured or unfeatured GIFs or both?
    let featured : boolean | null = null;
    if(req.query.featured != undefined) featured = req.query.featured === "true" || req.query.featured === "1";

    // Get all gifs
    db.GetGifs(featured).then(async (gifs) => {
        res.contentType("application/json").send(JSON.stringify(gifs));
    })
    .catch((err) => {
        console.log(err);
        res.status(500).send({status: 500});
    })
});

router.get("/pictures/:uuid", async (req, res) => {
    db.GetGif(req.params["uuid"]).then(async (gif) => {

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

        if(req.query["status"] == "true")
        {
            res.send({status: 200, message: "Image file has finished processing."});
            return;
        }

        // Get the gif from the S3 bucket
        const file = await bucket.getFile(gif.path);

        // Check if the file exists in the bucket
        if(!file)
        {
            res.status(404).send({status: 404, message: "Image file is not found."});
            return;
        }

        // Send the file
        res.contentType("image/gif").send(file);
    })
    .catch((err) => {
        console.log(err)
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

        return;
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
    const uuid = uuidv4();

    // Save uploaded files to s3
    const files = getFiles(req.files.files as UploadedFile[]);

    const delay = Math.round(parseFloat(req.body.delay) / 10);

    let filters = JSON.parse(req.body.filters) || {};
    filters['delay'] = [ delay.toString() ];

    // Create json data
    const jsonObj = {
        key: uuid,
        filters: filters,
        files: files.map(x => x.fileName),
    }

    // Add json file
    files.push({
        fileName: uuid + ".json",
        data: Buffer.from(JSON.stringify(jsonObj), 'utf-8')
    });

    // Upload all files
    bucket.uploadFiles(uuid, files).then(() => {

        db.RegisterGif(uuid, req.body.name, uuid + "/" + uuid + ".gif", req.body.featured == "true", new Date(), true).then(() => {
            res.contentType("application/json")
                .send({
                    "status": 200,
                    "message": "Started processing files.",
                    "uuid": uuid
                });
        })
        .catch((err) => {
            console.log(err)
            res.status(500).contentType("application/json")
                .send({
                    "status": 500,
                    "message": "Failed to register file.",
                    "uuid": uuid
            });
        });

    })
    .catch((err) => {
        console.log(err);
        res.status(500).contentType("application/json")
            .send({
                "status": 500,
                "message": "Failed to process files.",
                "uuid": uuid
        });
    });
});

export { router as APIRouter }
