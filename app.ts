import * as dotenv from 'dotenv';
dotenv.config();

import express from "express"; 
import bodyParser from 'body-parser';

import passportControl from './middleware/auth/passport-control'
import configureRouter from './config/router';

const app = express(); 
app.use(passportControl.initialize())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())


const router = express.Router();
app.use('/api', configureRouter(router));

export default app;