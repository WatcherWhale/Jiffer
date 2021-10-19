import fs from "fs";
import path from "path";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3"; //

export class Bucket
{
    private client;

    constructor(private readonly bucketName: string, private readonly userKey: string, 
                private readonly secretKey: string, region: string)
    {
        this.client = new S3Client({region: region});
    }

    public async uploadFile(filePath: string, fileName: string, featured: boolean = false) : Promise<string>
    {
        const folder = featured ? "featured" : "gifs";
        const objectPath = path.join(folder, fileName);

        await this.uploadFileToS3(filePath, objectPath);

        return objectPath;
    }

    private async uploadFileToS3(path: string, bucketPath: string)
    {
        const uploadParams = {
            Bucket: this.bucketName,
            Key: bucketPath,
            Body: fs.readFileSync(path),
        }

        return await this.client.send(new PutObjectCommand(uploadParams));
    }
}
