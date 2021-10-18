import process from 'process';
import cookieParser from 'cookie-parser';
import express from 'express';
import {login, registerUser, validateToken} from './helpers/cognito';

const router = express.Router();

router.use(cookieParser());

router.use(async (req, res, next) => {

    // Assume user is not authenticated
    req.authenticated = false;

    try
    {
        // Check if cookie exists
        if('JifferTokenCookie' in req.cookies)
        {
            if(process.env['NODE_ENV'] === "development" && req.cookies.JifferTokenCookie == "developer")
            {
                req.authenticated = true;
                next();
                return;
            }

            // Check if a valid cookie is given
            req.authenticated = await validateToken(req.cookies.JifferTokenCookie);
        }
    }
    catch(err)
    {
        console.log(err);
    }

    next();
});

router.post("/login", async (req, res) => {

    try
    {
        // Get login token
        var loginToken = await login(req.body.email, req.body.password);

        // Set cookie
        res.cookie('JifferTokenCookie', loginToken.getAccessToken().getJwtToken(),
                   { maxAge: 60*60*1000} )
            .send({status: 200});
    }
    catch(err)
    {
        console.log(err);
        res.status(500).send({status: 500});
    }

});

router.all("/logout", async(req, res) => {
    res.clearCookie("JifferTokenCookie").redirect("/");
});

router.post("/register", async (req, res) => {

    try
    {
        await registerUser(req.body.email, req.body.password);
        res.send({status: 200});
    }
    catch(err)
    {
        console.log(err)
        res.status(500).send({status: 500});
    }

});


export { router as AuthMiddleware }
