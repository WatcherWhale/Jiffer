import {UploadedFile} from "express-fileupload";
import fs from "fs";
import {IFile} from "../types/Interfaces";

export function getFiles(files: UploadedFile[]) : IFile[]
{
    // Save uploaded files
    const fileArr: IFile[] = [];

    for(const i in files)
    {
        const file = files[i];

        fileArr.push({
            fileName: file.name,
            data: file.data
        });
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

