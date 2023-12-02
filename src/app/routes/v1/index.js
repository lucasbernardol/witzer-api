import assert from 'node:assert/strict';
import { Router } from 'express';
import { StatusCodes } from 'http-status-codes';

import ShortenRouter from './shorten.routes.js';
import AnalyticsRouter from './analytics.routes.js';

import pkg from '../../../../package.json' assert { type: 'json' };

assert.ok(pkg?.version, '[package.json]');

export const routes = Router();

routes.get('/', (request, response, next) => {
  try {
    const { version } = pkg;

    return response.status(StatusCodes.OK).json({ version });
  } catch (error) {
    return next(error);
  }
});

/**a
 * Api routes
 */
routes.use('/api/v1', ShortenRouter);
routes.use('/api/v1', AnalyticsRouter);
