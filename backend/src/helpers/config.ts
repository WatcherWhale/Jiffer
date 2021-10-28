export interface IConfig
{
    port: number
    bucket: IBucket
    db: IDatabase
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
    port?: number
}

const config : IConfig = require("../../config.json");
export { config as Config };
