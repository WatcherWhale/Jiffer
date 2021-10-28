import path from "path";
import { S3Client, PutObjectCommand, GetObjectCommand } from "@aws-sdk/client-s3";
import {IFile} from "../types/Interfaces";
import {Stream} from "stream";
import {toBuffer} from "./streams";

export class Bucket
{
    private client;

    constructor(private readonly bucketName: string, region: string)
    {
        this.client = new S3Client({region: region});
    }

    public async getFile(bucketPath: string) : Promise<Buffer | undefined>
    {
        const params = {
            Bucket: this.bucketName,
            Key: bucketPath,
        }

        this.client.send(new GetObjectCommand(params)).then(file => {
            return toBuffer(file.Body as Stream);
        })
        .catch(() => {
            return undefined;
        });

        return undefined;
    }

    public async uploadFiles(dir: string, files: IFile[])
    {
        for(const i in files)
        {
            const file = files[i];
            const objPath = path.join(dir, file.fileName);

            await this.uploadFile(objPath, file.data);
        }
    }

    public async uploadFile(bucketPath: string, data: Buffer)
    {
        const uploadParams = {
            Bucket: this.bucketName,
            Key: bucketPath,
            Body: data,
        }

        return await this.client.send(new PutObjectCommand(uploadParams));
    }
}
