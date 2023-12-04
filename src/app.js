import express from 'express';
import cors from 'cors';

import helmet from 'helmet';
import morgan from 'morgan';

import { StatusCodes } from 'http-status-codes';

import { userAgent } from './app/middlewares/userAgent.js';
import { routes } from './app/routes/v1/index.js'; // v1 routes

export const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(helmet());
app.use(cors());

app.use(morgan('dev'));

app.use(userAgent()); // get current Agent

app.use(routes);

function handleError(error, request, response, next) {
  if (error) {
    const message = error?.message || 'Internal Error';

    return response.status(StatusCodes.BAD_REQUEST).json({ message });
  }

  return next(error);
}

app.use(handleError);
