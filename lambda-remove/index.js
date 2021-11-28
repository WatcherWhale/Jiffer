const process = require('process');
const aws = require('aws-sdk');
const path = require('path');
const mysql = require('mysql');

const s3 = new aws.S3({ apiVersion: '2006-03-01' });

let pool;

const handler = async (event) => {
    createPool();

    const bucket = process.env['bucket'];

    // TODO: CODE HERE

    // Look at backend for more an example of how to use this
    const results = await query("SQL QUERY HERE", []);

}

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
