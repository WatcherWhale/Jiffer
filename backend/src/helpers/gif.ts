import path from "path";
import ConvertAPI from "convertapi";
import { v4 as uuid } from "uuid";

const config = require('../../config.json');

const convertapi = new ConvertAPI(config["convert-key"]);

interface IGif
{
    id: string;
    path: string;
}

export async function generateGif(files: string[], delay: number) : Promise<IGif>
{
    const id = uuid();
    const gifPath = path.join("./temp", id + ".gif")

    const result = await convertapi.convert("gif", {
        Files: files,
        AnimationDelay: delay
    });

    // Save the gif
    await result.saveFiles(gifPath);

    return {
        id: id,
        path: gifPath
    };

}
