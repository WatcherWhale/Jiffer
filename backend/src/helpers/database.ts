import {IGif} from "../types/Interfaces";

export class Database
{
    constructor() {}

    public async RegisterGif(id: string, path: string) : Promise<void>
    {
        // TODO: Register gif in RDS
    }

    public async GetGif(id: string) : Promise<IGif>
    {
        // TODO: Get GIF data from database
        return {id: "", file: "", expires: 0, processing: false}
    }
}
