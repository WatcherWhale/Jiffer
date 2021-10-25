import express from 'express';

const router = express.Router();

router.use(async (req, res, next) => {

    // TODO: Add authentication system

    req.authenticated = true;

    next();
});

export { router as AuthMiddleware }
