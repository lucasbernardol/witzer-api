import express from 'express';
import cors from 'cors';

import helmet from 'helmet';
import morgan from 'morgan';

import hpp from 'hpp';
import { errors } from 'celebrate';

import { notFoundError } from './app/middlewares/notFoundError.js';
import { errorHandler } from './app/middlewares/errorHandler.js';

import { userAgent } from './app/middlewares/userAgent.js';
import { isRobot } from './app/middlewares/isRobot.js';

import { routes } from './app/routes/v1/index.js'; // v1 routes

export const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(helmet());
app.use(cors());

app.use(morgan('dev'));

app.use(hpp());

//app.use(isRobot());
app.use(userAgent());

app.use(routes);

app.use(notFoundError());

app.use(errors()); // celebrate error handling

app.use(errorHandler());
