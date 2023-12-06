import { Router } from 'express';
import { celebrate, Segments } from 'celebrate';

import { rateLimit } from 'express-rate-limit';
import { RedisStore } from 'rate-limit-redis';

import HttpError from 'http-errors';

import ShortenController from '../../controllers/ShortenController.js';
import { RawOrJson } from '../../validations/types/format.js';

import { hashSchema } from '../../validations/hashSchema.js';
import { urlSchema } from '../../validations/urlSchema.js';

import { redisClient } from '../../../modules/redis/client.js';

const controller = new ShortenController();

const routes = Router();

const redisStore = new RedisStore({
  sendCommand: (...args) => redisClient.sendCommand(args),
});

const rateLimiterHandler = (request, response, next, { message }) => {
  return next(new HttpError.TooManyRequests(message));
};

const shortCreateLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minutes
  max: 5,
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: (request) => `L-CREATE:${request.ip}`,
  handler: rateLimiterHandler,
  store: redisStore,
});

const shortDeleteLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minutes
  max: 1,
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: (request) => `L-DELETE:${request.ip}`,
  handler: rateLimiterHandler,
  store: redisStore,
});

routes.get(
  '/shorts/:hash/views',
  celebrate({ [Segments.PARAMS]: hashSchema() }),
  controller.views,
);

routes.get(
  '/shorts/:hash',
  celebrate({
    [Segments.PARAMS]: hashSchema(),
    [Segments.QUERY]: {
      format: RawOrJson(),
    },
  }),
  controller.resolving,
); // returns original url

routes.post(
  '/shorts',
  shortCreateLimiter,
  celebrate({ [Segments.BODY]: urlSchema() }),
  controller.create,
);

routes.delete(
  '/shorts/:hash',
  shortDeleteLimiter,
  celebrate({ [Segments.PARAMS]: hashSchema() }),
  controller.delete,
);

export default routes;
