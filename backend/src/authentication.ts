import express from 'express';
import {login, registerUser, validateToken} from './helpers/cognito';

const router = express.Router();

router.use(async (req, res, next) => {

    // TODO: Validate Token

    req.authenticated = true;

    next();
});

router.post("/login", async (req, res) => {
    // TODO: Login user
});

router.post("/register", async (req, res) => {
    // TODO: Register user
});

export { router as AuthMiddleware }
