import express from 'express';
import fileUpload from 'express-fileupload';
import { APIRouter } from './api';
import { AuthMiddleware } from './authentication';
import { Config } from './helpers/config';

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(fileUpload({
    useTempFiles : false
}));
app.use(AuthMiddleware);

// Register Routes
app.use("/api", APIRouter);

// 404 Error
app.use((req, res, next) => {
    res.status(404).contentType("application/json")
        .send({status: 404});
});

app.listen(Config.port);
