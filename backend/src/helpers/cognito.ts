import AmazonCognitoIdentity, {CognitoUserAttribute} from 'amazon-cognito-identity-js';
import request from 'request';
import jwkToPem from 'jwk-to-pem';
import jwt from 'jsonwebtoken';
import { Config } from './config';

// TODO: Check if this piece of code is in fact needed, my bet is no.
global.fetch = require('node-fetch');

const poolData = {
  UserPoolId: Config.cognito.poolId,
  ClientId: Config.cognito.clientId
}
const pool_region = Config.cognito.poolRegion;

const userPool = new AmazonCognitoIdentity.CognitoUserPool(poolData);
function registerUser(email :string, password :string) {
  return new Promise((resolve, reject) => {
    const attributeList = [
      new AmazonCognitoIdentity.CognitoUserAttribute({ Name: "email", Value: email })
    ];
    // TODO: Check if I can fill in empty array or has to be null
    userPool.signUp(email, password, attributeList, [], function(err :any, result :any) {
      if (err) {
        reject(err);
      } else {
        resolve(result.user);
      }
    });
  });
}
function login(email:string, password:string) {
  return new Promise((resolve, reject) => {
    const authenticationDetails = new AmazonCognitoIdentity.AuthenticationDetails({
      Username : email,
      Password : password,
    });
    const userData = {
      Username: email,
      Pool: userPool
    };
    const cognitoUser = new AmazonCognitoIdentity.CognitoUser(userData);
    cognitoUser.authenticateUser(authenticationDetails, {
      onSuccess: function (result :any) {
        resolve(result);
      },
      onFailure: function(err:any) {
        reject(err);
      },
    });
  });
}

function validateToken(token :any) {
  return new Promise((resolve, reject) => {
    request({
      url: `https://cognito-idp.${pool_region}.amazonaws.com/${poolData.UserPoolId}/.well-known/jwks.json`,
      json: true
    }, function (error :any, response:any, body:any) {
      if (!error && response.statusCode === 200) {
        let pems:any;
        pems = {} ;
        var keys = body['keys'];
        for(var i = 0; i < keys.length; i++) {
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
        if (!decodedJwt) {
          reject("Not a valid JWT token");
          return;
        }
        var kid = decodedJwt.header.kid as string;
        var pem = pems[kid] as string;
        if (!pem) {
          reject('Invalid token');
          return;
        }
        jwt.verify(token, pem, function(err:any, payload:any) {
          if (err) {
            reject("Invalid Token.");
          } else {
            resolve("Valid Token.");
          }
        });
      } else {
        reject("Error! Unable to download JWKs");
      }
    })
  })
}

export {registerUser, login, validateToken}
