import { Router } from 'express';

import { HealthController } from '@controllers/health.controller';
import { ShortenedController } from '@controllers/shortened.controller';

import { ReportController } from '@controllers/report-violation.controller';
import { celebrate, HASH_PLAIN, HASH, BODY } from './app.schemas';

const routes = Router();

const health = new HealthController();
const controller = new ShortenedController();
const violation = new ReportController();

routes.get('/', health.version);
routes.get('/stats', health.stats);

/**
 * - Redirectings:
 * 	http://localhost:3333/e5f87aH7 --> https://www.google.com/?q=Node.js
 */
routes.get('/:hash', celebrate(HASH), controller.redirectings);

/**
 * Links API/v1
 */
routes.get('/api/links/format/:hash', celebrate(HASH), controller.format);
routes.get('/api/links/qrcode/:hash', celebrate(HASH_PLAIN), controller.qrcode);
routes.post('/api/links', celebrate(BODY), controller.create);

/**
 * CSP violation by Helmet.js
 */
routes.post('/report-violation', violation.report);

export { routes };
