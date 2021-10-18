import {IGif} from "../types/Interfaces";
import { Config } from "./config";
import mysql from 'mysql';

export class Database
{
    private pool : mysql.Pool;

    constructor()
    {
        this.pool = mysql.createPool((Config.db))
    }

    private getConnection() : Promise<mysql.PoolConnection>
    {
        return new Promise((resolve, reject) => {
            this.pool.getConnection((err, connection) => {

                if(err)
                {
                    reject(err);
                    return;
                }

                resolve(connection);
            });
        });
    }

    private query(connection: mysql.PoolConnection, options: string | mysql.QueryOptions, values: any = null) : Promise<any>
    {
        return new Promise((resolve, reject) => {
            connection.query(options, values, (err, results, fields) => {

                if(err)
                {
                    reject(err);
                    return;
                }

                resolve(results);
            });
        });
    }

    public async RegisterGif(uuid: string, name:string, path: string, featured: boolean, creationDate: Date, processing : boolean ) : Promise<void>
    {
        const connection = await this.getConnection();
        await this.query(connection, 'INSERT INTO gifs VALUES (?, ?, ?, ?, ?, ?)', [ uuid, name, path, featured ? 1 : 0 , creationDate, processing ? 1 : 0 ]);
        connection.release();
    }

    public async GetGif(uuid: string) : Promise<IGif | undefined>
    {
        const connection = await this.getConnection();
        const rows = await this.query(connection, 'SELECT * FROM gifs WHERE uuid=?', [ uuid ]);

        // If no results are returned, return an undefined object
        if(rows.length <= 0) return undefined;

        connection.release();

        return rows[0];
    }

    public async GetGifs(featured: boolean | null = null) : Promise<IGif[]>
    {
        const connection = await this.getConnection();

        let rows;
        if(featured != null)
        {
            rows = await this.query(connection, 'SELECT * FROM gifs WHERE processing=? AND featured=?', [ 0, featured ? 1 : 0 ]);
        }
        else
        {
            rows = await this.query(connection, 'SELECT * FROM gifs WHERE processing=?', [ 0 ]);
        }


        connection.release();

        return rows;
    }
}
