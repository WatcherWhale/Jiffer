import express from 'express';
import { emitWarning } from 'process';
import {login, registerUser, validateToken} from './helpers/cognito';

const router = express.Router();

router.use(async (req, res, next) => {

    req.authenticated = await validateToken(req.cookies.JifferTokenCookie)
    next();
}); 

router.post("/login", async (req, res) => {
  
    var loginToken = login(req.body.email, req.body.password)
    res.cookie('JifferTokenCookie', loginToken,{ maxAge: 60*60*1000} ).send({status: 200});
    
});

router.post("/register", async (req, res) => {

    registerUser(req.body.email, req.body.password) 
    res.send({status: 200});
    
});

export { router as AuthMiddleware }
