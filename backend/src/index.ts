import express from 'express';
import fileUpload from 'express-fileupload';
import { APIRouter } from './api';

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(fileUpload({
    useTempFiles : false
}));

// Register Routes
app.use("/api/v1", APIRouter);

app.listen(8080);
