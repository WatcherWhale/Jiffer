export interface IConfig
{
    port: number
    useStaticBucket: boolean
    buckets: IBuckets
    db: IDatabase
    cognito: ICognito
}

export interface IBuckets
{
    gifs: IBucket;
    static: IBucket;
}

export interface IBucket
{
    region: string
    name: string
}

export interface IDatabase
{
    host: string
    user: string
    password: string
    port: number
    database: string
}

export interface ICognito
{
    poolId: string
    clientId: string
    poolRegion: string
}


const config : IConfig = require("../../config.json");
export { config as Config };
