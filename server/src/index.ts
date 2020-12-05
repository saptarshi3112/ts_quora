import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';

import { dbInit, environment } from './config';
import { routerLogger } from './middleware';

import rootRouter from './routes';

// initiliase database.
dbInit();

const app = express();

// setting up
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: false
}));
app.use(cors());

app.use('/', routerLogger, rootRouter);

const port = environment.port;
app.listen(port, () => console.log(`Server on port ${port}`));
