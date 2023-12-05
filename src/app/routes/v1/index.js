import { Router } from 'express';
import { celebrate, Segments } from 'celebrate';

import AppController from '../../controllers/AppController.js';
import ShortenController from '../../controllers/ShortenController.js';

import { hashSchema } from '../../validations/hashSchema.js';

import ShortenRouter from './shorten.routes.js';
import AnalyticsRouter from './analytics.routes.js';

const appController = new AppController();

const shortenController = new ShortenController();

export const routes = Router();

routes.get('/', appController.version);

routes.get(
  '/:hash',
  celebrate({ [Segments.PARAMS]: hashSchema() }),
  shortenController.redirecting,
);

/**a
 * Api routes
 */
routes.use('/api/v1', ShortenRouter);
routes.use('/api/v1', AnalyticsRouter);
