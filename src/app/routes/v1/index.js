import { Router } from 'express';
import { AppController } from '../../controllers/AppController.js';

import ShortenRouter from './shorten.routes.js';
import AnalyticsRouter from './analytics.routes.js';

const controller = new AppController();

export const routes = Router();

routes.get('/', controller.version);

/**a
 * Api routes
 */
routes.use('/api/v1', ShortenRouter);
routes.use('/api/v1', AnalyticsRouter);
