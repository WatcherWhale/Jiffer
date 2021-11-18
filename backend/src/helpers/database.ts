import { PutObjectLockConfigurationCommand } from "@aws-sdk/client-s3";
import {IGif} from "../types/Interfaces";
import { Config } from "./config";


export class Database
{
    mysql= require('mysql');
    pool= this.mysql.createPool({
        host: Config.db.host,
        user: Config.db.user,
        password: Config.db.password,
        database: Config.db.port        //not sure if this is the port/name of the database?
    })

    constructor() {}

    public async RegisterGif(id: string, path: string) : Promise<void>
    {
        this.pool.getConnection((err :string,connection :any)=>{
            if(err)
                console.log("connection with database failed")
            connection.query()
            connection.release()
        })
    }

    public async GetGif(id: string) : Promise<IGif | undefined>
    {

        this.pool.GetConnection((err:string, connection:any)=>{
            if(err)
                console.log("connection with database failed")

            connection.query()
            connection.release()
        })

        return {id: "", file: "", expires: 0, processing: false}
    }
}
