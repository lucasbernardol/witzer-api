import { Router } from 'express';
import isURL from 'validator/lib/isURL';

import Joi from 'joi';
import { celebrate, Segments } from 'celebrate';

import { HealthController } from '@controllers/health.controller';
import { MainController } from '@controllers/main.controller';

import { hash } from '@middlewares/hash.middleware';
import { sha512 } from '@utils/crypto/sha-512.util';

const routes = Router();

const health = new HealthController();
const controller = new MainController();

const HOST = process.env.HOST;

const syncValidationHash = (value: any, helpers: Joi.CustomHelpers<any>) => {
  // if (!value) {
  //   return value;
  // }

  return sha512(value);
};

const urlValidation = (value: any, helpers: Joi.CustomHelpers<any>) => {
  const isValidURLAddress = isURL(value, {
    host_blacklist: [new URL(HOST).host], // prevent redirecting loops (simple domain)
  });

  if (isValidURLAddress) {
    return value;
  } else {
    return helpers.message({
      custom: '"href" is not URL or blocked domain',
    });
  }
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
      href: Joi.string().min(10).max(2048).required().custom(urlValidation),
    },
  }),
  hash(),
  controller.create
);

export { routes };
