interface IConfig
{
    port: number

    bucket: IBucket
}

interface IBucket
{
    region: string
    name: string
}

const config : IConfig = require("../../config.json");
export { config as Config };
