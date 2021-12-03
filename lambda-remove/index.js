const process = require('process');
const aws = require('aws-sdk');
const path = require('path');
const mysql = require('mysql');

const s3 = new aws.S3({ apiVersion: '2006-03-01' });

let pool;
console.log("start")
const handler = async (event) => {
    console.log("creating connection")
    createPool();
    
    const bucket = process.env['bucket'];

    // TODO: CODE HERE
    console.log("query")
    // Look at backend for more an example of how to use this
    const results = await query("select * from gifs where creationDate < current_date() and featured = 0", []);
    const featuredResults = await query("select * from gifs where creationDate + 30 < current_date() and featured = 1",[])

    // async function deleteFromS3(bucket, path) {
    //     const listParams = {
    //         Bucket: bucket,
    //         Prefix: path
    //     };

    //     const listedObjects = await s3.listObjectsV2(listParams).promise();
    //     console.log("listedObjects", listedObjects);
    //     if (listedObjects.Contents.length === 0) return;
    
    //     const deleteParams = {
    //         Bucket: bucket,
    //         Delete: { Objects: [] }
    //     };
    
    //     listedObjects.Contents.forEach(({ Key }) => {
    //         deleteParams.Delete.Objects.push({ Key });
    //     });

    //     console.log("deleteParams", deleteParams);
    //     const deleteResult = await s3.deleteObjects(deleteParams).promise();
    //     console.log("deleteResult", deleteResult);
    //     if (listedObjects.IsTruncated && deleteResult)
    //         await deleteFromS3(bucket, path);
    // }
    // try{
    // for (let i in results) {
    //     var querryResult = results[i]
    //     const testDelete = await deleteFromS3(bucket, `${querryResult.uuid}/`);
    // }
    // }
    // catch (e){
    //     console.log(e);
    // }   

    for (let i in results) {
        const result = results[i]

        var paramsFolder = { Bucket: bucket, Key: `${result.uuid}/`}
        var params = {  Bucket: bucket, Key: result.uuid };
        console.log("checking results",result.uuid)
        await s3.deleteObject(params, function(err, data) {
            if (err) console.log(err, err.stack);  // error
            else     console.log();                 // deleted
        }).promise();
        // await s3.deleteObject(paramsFolder,function(err, data){
        //     if (err) console.log(err,err.stack);
        //     else console.log();
        // }).promise();
        }
    }

    for (let i in results) {
        const result = results[i].uuid

        var params = {  Bucket: bucket, Key: result.uuid };

        s3.deleteObject(params, function(err, data) {
            if (err) console.log(err, err.stack);  // error
            else     console.log();                 // deleted
        });
    }

    await query("delete from gifs where creationDate < current_date() and featured = 0", [])
    await query("delete from gifs where creationDate + 30 < current_date() and featured = 1",[])
    console.log(results)
    console.log(featuredResults)



const createPool = () => {
    pool = mysql.createPool({
        host: process.env['host'],
        user: process.env['user'],
        password: process.env['password'],
        database: process.env['database']
    });
};

const getConnection = () => {
    return new Promise((resolve, reject) => {

        pool.getConnection((err, connection) => {
            if(err)
            {
                reject(err);
                return;
            }

            resolve(connection);
        });
    });
}

const query = (sql, values) => {
    return new Promise(async (resolve, reject) => {
        const connection = await getConnection();
        connection.query(sql, values, (err, results, fields) => {
            connection.release();
            if(err)
            {
                reject(err);
                return;
            }
            console.log(results)
            resolve(results);
        });
    });
}

exports.handler = handler;
