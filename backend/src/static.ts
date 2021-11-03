import express from "express";
import {Bucket} from "./helpers/bucket";
import {Config} from "./helpers/config";
import * as FileType from "file-type";
import path from "path";

const staticRouter = express.Router();

// Use static assets from a s3 bucket
if(Config.useStaticBucket)
{
    const bucket = new Bucket(Config.buckets.static.name, Config.buckets.static.region);

    staticRouter.use(async (req, res, next) => {

        // Get the file path to query the s3 buket
        let reqPath = req.path;
        if(req.path == "/") reqPath = "/index.html";
        reqPath = reqPath.slice(1);

        bucket.getFile(reqPath).then(async (file) => {
            // File does not exist, continue with other routing methods
            if(file == undefined)
            {
                next();
                return;
            }

            // Get the filetype of the file
            const type = await FileType.fromBuffer(file);

            if(type)
            {
                res.contentType(type.mime).send(file);
            }
            else
            {
                const ext = path.extname(reqPath).slice(1);
                res.contentType("text/" + ext).send(file);
            }
        });
    });
}
else
{
    staticRouter.use(express.static("static"));
}

export { staticRouter as Static }
