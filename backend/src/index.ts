import express from 'express';
import fileUpload from 'express-fileupload';
import { APIRouter } from './api';
import { JIFFRouter } from './jiff';
import { AuthMiddleware } from './authentication';
import { Config } from './helpers/config';
import {Static} from './static';

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(fileUpload({
    useTempFiles : false
}));
app.use(AuthMiddleware);

// Register API
app.use("/api", APIRouter);
app.use("/jiff", JIFFRouter);

// Register static assets
app.use(Static);

// 404 error page redirect
app.use(async (req, res, next) => {
    res.redirect("/#/404");
});


// Start Server
app.listen(Config.port, () => {
    console.log("Server started on port " + Config.port);
});
