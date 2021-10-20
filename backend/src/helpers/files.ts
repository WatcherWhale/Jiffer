import {UploadedFile} from "express-fileupload";
import fs from "fs";
import path from "path";

export async function downloadFiles(files: UploadedFile[]) : Promise<string[]>
{
    // Create the temp folder if it doesn't exists
    if(!fs.existsSync("./temp"))
    {
        fs.mkdirSync("./temp");
    }

    // Save uploaded files
    const fileArr: string[] = [];

    for(const i in files)
    {
        const file = path.join("./temp/", files[i].name);
        await files[i].mv(file);
        fileArr.push(file)
    }

    return fileArr;
}

export function removeFilesSync(files: string[])
{
    for(const i in files)
    {
        fs.rmSync(files[i]);
    }
}

