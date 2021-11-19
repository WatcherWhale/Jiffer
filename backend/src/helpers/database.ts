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
        port: Config.db.port
    })

    public async MakeDatabase()
    {
        this.pool.getConnection((err: string, connection: any)=>{
            if(err)
                console.log("connection with database failed :(")
            console.log("connected")

            connection.query('CREATE DATABASE IF NOT EXISTS JifferDB;')
            connection.query('USE JifferDB;')
            connection.query('CREATE TABLE IF NOT EXISTS gifs(uuid CHAR(36) NOT NULL PRIMARY KEY, name VARCHAR(50), path VARCHAR(100), featured TINYINT, creationDate DATE )')

            connection.release()
        })

    }

    public async RegisterGif(id: string, path: string) : Promise<void>
    {
        this.pool.getConnection((err: string, connection: any)=>{
            if(err)
                console.log("connection with database failed")
            console.log("connected database")
            connection.query()
            connection.release()
        })
    }

    public async GetGif(id: string) : Promise<IGif | undefined>
    {

        this.pool.GetConnection((err: string, connection: any)=>{
            if(err)
                console.log("connection with database failed")
            console.log("connected database")

            connection.query()
            connection.release()
        })

        return {id: "", file: "", expires: 0, processing: false}
    }
}
