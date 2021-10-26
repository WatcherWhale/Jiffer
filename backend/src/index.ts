import process from 'process';
import express from 'express';
import fileUpload from 'express-fileupload';
import { APIRouter } from './api';
import { AuthMiddleware } from './authentication';

const app = express();
const config = require('../config.json');

// Middleware
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(fileUpload({
    useTempFiles : false
}));
app.use(AuthMiddleware);

// Register Routes
app.use("/api/v1", APIRouter);

app.listen(config.port, () => {
    console.log("Server started on port " + config.port);
});
