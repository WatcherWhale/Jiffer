import express from 'express';
import fileUpload from 'express-fileupload';
import { APIRouter } from './api';

const app = express();
const config = require('../config.json');

// Middleware
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(fileUpload({
    useTempFiles : false
}));

// Register Routes
app.use("/api/v1", APIRouter);

app.listen(config.port);
