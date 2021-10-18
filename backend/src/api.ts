import fs from 'fs';
import express from 'express';
import ConvertAPI from "convertapi";
import {UploadedFile} from 'express-fileupload';

const router = express.Router();
const convertapi = new ConvertAPI('axikhXdmDlqY2I5R');

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
        const file = "./temp/" + files[i].name;
        await files[i].mv(file);
        fileArr.push(file)
    }


    // Upload files to the GIF-api
    const result = await convertapi.convert("gif", {
        Files: fileArr,
        AnimationDelay: req.body.delay
    });

    // Save the gif
    await result.saveFiles("temp/" + req.body.name + ".gif");

    // Remove files
    for(const i in fileArr)
    {
        fs.rmSync(fileArr[i]);
    }

    // TODO: Upload to a s3 bucket

    res.contentType("application/json")
        .send({"status": 200});
});

export { router as APIRouter }
