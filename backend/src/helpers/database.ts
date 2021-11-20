import { PutObjectLockConfigurationCommand } from "@aws-sdk/client-s3";
import { resolve } from "path/posix";
import {IGif} from "../types/Interfaces";
import { Config } from "./config";
import { Bucket } from "./bucket";
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
                return new Promise((reject)=>{                                  //used "promisifying" technique
                    if(err){
                        reject(err)
                        return
                    }
            
                    connection.query('INSERT INTO gifs VALUES (?, ?, ?, ?, ?)', [ id, name, path, featured, creationDate ], (err: string, result: any)=>{
                        if(err){
                            reject(err)
                            return
                        }
                    })
                    connection.release()
                })
                
            })
        
    }

    public async GetGif(id: string) : Promise<IGif | undefined>
    {

        this.pool.GetConnection((err: string, connection: any)=>{
            return new Promise((resolve, reject)=>{
                if(err){
                    reject(err)
                    return
                }

                connection.query('SELECT path FROM gifs WHERE uuid=?', [ id ], (err: string, path: any)=>{
                    if(err){
                        reject(err)
                        return
                    }
                    resolve(Bucket.prototype.getFile(path)) //this?, i'm flipping my head
                })
                connection.release()
            })

            
        })

        return {id: "", file: "", expires: 0, processing: false}    //dunno what you wanna do with this :3
    }
}
