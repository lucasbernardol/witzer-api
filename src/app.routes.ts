import { Router } from 'express';
import { celebrate, Segments, Joi } from 'celebrate';

import { HealthController } from '@controllers/health.controller';
import { MainController } from '@controllers/main.controller';

import { createHashSha512 } from '@utils/crypto/hash.util';

import { hash } from './app.middlewares';

const routes = Router();

const health = new HealthController();
const controller = new MainController();

const syncValidationHash = (value: any, helpers: any) => {
  if (!value) {
    return value;
  }

  return createHashSha512(value);
};

routes.get('/', health.version);
routes.get('/stats', health.stats);

routes.get(
  '/:hash',
  celebrate({
    [Segments.PARAMS]: Joi.object({
      hash: Joi.string().min(7).max(7).required().custom(syncValidationHash),
    }),
  }),
  controller.resolves
);

routes.get(
  '/api/links/format/:hash',
  celebrate({
    [Segments.PARAMS]: Joi.object({
      hash: Joi.string().min(7).max(7).required().custom(syncValidationHash),
    }),
  }),
  controller.format
);

routes.get(
  '/api/links/qrcode/:hash',
  celebrate({
    [Segments.PARAMS]: Joi.object({
      hash: Joi.string().min(7).max(7).required(), // no hashes
    }),
  }),
  controller.qrcode
);
routes.post(
  '/api/links',
  celebrate({
    [Segments.BODY]: {
      href: Joi.string().min(10).max(2048).uri().required(), // add URL regex
    },
  }),
  hash(),
  controller.create
);

export { routes };
