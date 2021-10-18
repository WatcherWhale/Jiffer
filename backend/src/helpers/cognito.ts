import {AuthenticationDetails, CognitoUser, CognitoUserAttribute, CognitoUserPool, CognitoUserSession} from 'amazon-cognito-identity-js';
import request from 'request';
import jwkToPem from 'jwk-to-pem';
import jwt from 'jsonwebtoken';
import { Config } from './config';

const poolData = {
    UserPoolId: Config.cognito.poolId,
    ClientId: Config.cognito.clientId
}
const pool_region = Config.cognito.poolRegion;

// Create user pool
const userPool = new CognitoUserPool(poolData);

function registerUser(email: string, password: string)
{
    return new Promise((resolve, reject) => {

        const attributeList = [ new CognitoUserAttribute({ Name: "email", Value: email }) ];

        userPool.signUp(email, password, attributeList, [], (err :any, result :any) => {

            if (err)
            {
                reject(err);
            }
            else
            {
                resolve(result.user);
            }
        });
    });
}

function login(email: string, password: string) : Promise<CognitoUserSession>
{
    return new Promise((resolve, reject) => {

        const authenticationDetails = new AuthenticationDetails({
            Username : email,
            Password : password,
        });

        const userData = {
            Username: email,
            Pool: userPool
        };

        const cognitoUser = new CognitoUser(userData);

        cognitoUser.authenticateUser(authenticationDetails, {
            onSuccess: resolve,
            onFailure: reject
        });
    });
}

function validateToken(token: any) : Promise<boolean>
{
    return new Promise((resolve, reject) => {

        request({
            url: `https://cognito-idp.${pool_region}.amazonaws.com/${poolData.UserPoolId}/.well-known/jwks.json`,
            json: true
        }, (error: any, response: any, body: any) => {

            if (!error && response.statusCode === 200)
            {
                let pems: any = {};
                var keys = body['keys'];

                for(var i = 0; i < keys.length; i++)
                {
                    //Convert each key to PEM
                    var key_id = keys[i].kid;
                    var modulus = keys[i].n;
                    var exponent = keys[i].e;
                    var key_type = keys[i].kty;

                    var jwk = { kty: key_type, n: modulus, e: exponent};
                    var pem = jwkToPem(jwk);

                    pems[key_id] = pem;
                }

                //validate the token
                var decodedJwt = jwt.decode(token, {complete: true});

                if (!decodedJwt)
                {
                    resolve(false);
                    return;
                }

                var kid = decodedJwt.header.kid as string;
                var pem = pems[kid] as string;

                if (!pem)
                {
                    resolve(false);
                    return;
                }

                jwt.verify(token, pem, (err: any, payload: any) => {

                    if (err)
                    {
                        resolve(false);
                    }
                    else
                    {
                        resolve(true);
                    }
                });
            }
            else
            {
                reject("Error! Unable to download JWKs");
            }
        })
    })
}

export {registerUser, login, validateToken}
