import { Router } from 'express';
import { celebrate, Segments } from 'celebrate';

import { HealthController } from '@controllers/health.controller';
import { LinkController } from './controllers/link.controller';

import {
  bodySchema,
  hashSchema,
  hashSchemaWithoutEncoding,
} from './app.schemas';

import { hash } from './app.middlewares';

const routes = Router();

const health = new HealthController();
const controller = new LinkController();

const params = (schema: any) => celebrate({ [Segments.PARAMS]: schema });
const body = (schema: any) => celebrate({ [Segments.BODY]: schema });

routes.get('/', health.version);
routes.get('/stats', health.stats);
routes.get('/:hash', params(hashSchema), controller.resolves);

routes.get('/api/links/format/:hash', params(hashSchema), controller.format);
routes.get(
  '/api/links/qrcode/:hash',
  params(hashSchemaWithoutEncoding),
  controller.qrcode
);

routes.post('/api/links', body(bodySchema), hash(), controller.create);

export { routes };
