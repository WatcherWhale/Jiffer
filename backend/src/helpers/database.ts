import { PutObjectLockConfigurationCommand } from "@aws-sdk/client-s3";
import {IGif} from "../types/Interfaces";
import { Config } from "./config";
//import { Mysql } from "mysql";


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

            connection.query('CREATE DATABASE IF NOT EXISTS JifferDB;', (err: string, results: any)=>{
                if(err)
                    console.log("database creation failed")
                connection.query('USE JifferDB;', (err: any, results: any)=>{
                    if(err)
                        console.log("using JifferDB failed")
                    connection.query('CREATE TABLE IF NOT EXISTS gifs(uuid CHAR(36) NOT NULL PRIMARY KEY, name VARCHAR(50), path VARCHAR(100), featured TINYINT, creationDate DATE )', (err: string, results: any)=>{
                        if(err)
                            console.log("table creation failed")
                        console.log("succesfully created JifferDB and table")
                    })
                })
            })

            connection.release()
        })
    }

    public async RegisterGif(id: string, name:string, path: string, featured: boolean, creationDate: Date ) : Promise<void>
    {
        this.pool.getConnection((err: string, connection: any)=>{
            if(err)
                console.log("connection with database failed")
            console.log("connected with database")
            
            connection.query('INSERT INTO gifs VALUES (?, ?, ?, ?, ?)', { values: [ id, name, path, featured, creationDate ] }, (err: string, result: any)=>{
                if(err)
                    console.log("could not insert values in the database")
            })

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
