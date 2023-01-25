import express from 'express';
import type { Request, Response, NextFunction } from 'express';

import compression from 'compression';

import { isHttpError, NotFound } from 'http-errors';
import { errors } from 'celebrate';

import helmet from 'helmet';
import cors from 'cors';

import morgan from 'morgan';
import hpp from 'hpp';

import { routes } from './app.routes';

export const app = express();

app.use(compression());

/**
 * - Content-Types:
 * 	application/json --> JSON
 *  application/csp-report --> JSON/LIKE BASED
 */
app.use(express.json());
app.use(express.json({ type: 'application/csp-report' }));

app.use(express.urlencoded({ extended: false }));

app.enable('trust proxy');

app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        reportUri: '/report-violation',
      },
    },
  })
);
app.use(cors());

app.use(
  hpp({
    checkBody: false,
    checkQuery: true,
  })
);

app.use(morgan('dev'));
app.use(routes);

app.use(errors()); // Celebrate/Joi validation ERRORS.

app.use((request, response, next) => {
  return next(new NotFound());
});

app.use((error: Error, _: Request, response: Response, next: NextFunction) => {
  if (isHttpError(error) /* asserts */) {
    return response.status(error.status).json({
      name: error.name,
      status: error.statusCode,
      message: error.message,
    });
  } else {
    return response.status(500).json({ message: 'Internal server exception' });
  }
});
