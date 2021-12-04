import express from 'express';
import { Bucket } from './helpers/bucket';
import { Config } from './helpers/config'

const bucket = new Bucket(Config.buckets.static.name, Config.buckets.static.region);
const router = express.Router();

// Page not found
router.use(async (req, res, next) => {
    const index = await bucket.getFile("index.html");
    res.contentType("text/html").send(index);
});

export { router as Router404 }
