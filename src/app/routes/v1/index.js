import { Router } from 'express';
import { celebrate, Segments } from 'celebrate';

import AppController from '../../controllers/AppController.js';
import ShortenController from '../../controllers/ShortenController.js';

import ShortenRouter from './shorten.routes.js';
import AnalyticsRouter from './analytics.routes.js';

import { hashSchema } from '../../validations/hashSchema.js';

export const routes = Router();

routes.get('/', AppController.version);

routes.get(
  '/:hash',
  celebrate({ [Segments.PARAMS]: hashSchema() }),
  ShortenController.redirecting,
);

/**a
 * Api routes
 */
routes.use('/api/v1', ShortenRouter);
routes.use('/api/v1', AnalyticsRouter);
