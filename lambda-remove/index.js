const process = require('process');
const aws = require('aws-sdk');
const path = require('path');
const mysql = require('mysql');

const s3 = new aws.S3({ apiVersion: '2006-03-01' });
let pool;

console.log("Lambda starting...");

const handler = async (event) => {
    console.log("Started nightly cleaning check.")

    const bucket = process.env['bucket'];

    console.log("Querying database");
    createPool();
    const results = await query("SELECT * FROM gifs WHERE creationDate < current_date() AND featured = 0");
    const featuredResults = await query("SELECT * FROM gifs WHERE creationDate + INTERVAL 30 day < current_date() AND featured = 1")

    console.log("Deleting files from S3");
    const promises = [];

    // Start deleting unfeatured gifs
    for(const i in results)
    {
        const result = results[i];
        promises.push(deleteFolder(bucket, result.uuid));
    }

    // Start deleting featured gifs
    for(const i in featuredResults)
    {
        const result = featuredResults[i];
        promises.push(deleteFolder(bucket, result.uuid));
    }

    // Wait until everything is deleted
    for(const i in promises)
    {
        await promises[i];
    }

    console.log("All files/folders are deleted from S3");

    // Delete entries from database
    console.log("Deleting database entries.");

    await query("DELETE FROM gifs WHERE creationDate < current_date() AND featured = 0")
    await query("DELETE FROM gifs WHERE creationDate + current_date() + INTERVAL 30 day < current_date() AND featured = 1")

    console.log("Nightly cleaning of gifs complete!");
}

const deleteFolder = async (bucket, folder) => {
    const listParams = {
        Bucket: bucket,
        Prefix: folder + "/"
    }

    const files = await s3.listObjectsV2(listParams).promise();

    let keyArr = [];

    for(const i in files.Contents)
    {
        keyArr.push({Key: files.Contents[i].Key});
    }

    const deleteParams = {
        Bucket: bucket,
        Delete: {
            Objects: keyArr
        }
    }

    const folderParams = {
        Bucket: bucket,
        Key: folder + "/"
    }

    await s3.deleteObjects(deleteParams).promise();
    await s3.deleteObject(folderParams).promise();

};

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

const query = (sql, values = []) => {
    return new Promise(async (resolve, reject) => {
        const connection = await getConnection();
        connection.query(sql, values, (err, results, fields) => {
            connection.release();
            if(err)
            {
                reject(err);
                return;
            }

            resolve(results);
        });
    });
}

exports.handler = handler;
