import { Router } from 'express';
import { celebrate, Segments } from 'celebrate';

import { rateLimit } from 'express-rate-limit';
import { RedisStore } from 'rate-limit-redis';

import HttpError from 'http-errors';

import ShortenController from '../../controllers/ShortenController.js';

import { hashSchema } from '../../validations/hashSchema.js';
import { urlSchema } from '../../validations/urlSchema.js';

import { redisClient } from '../../../modules/redis/client.js';

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
  '/shorts/:hash',
  celebrate({
    [Segments.PARAMS]: hashSchema(),
  }),
  ShortenController.findByPK,
); // returns original url

routes.get(
  '/shorts/:hash/views',
  celebrate({ [Segments.PARAMS]: hashSchema() }),
  ShortenController.views,
);

routes.post(
  '/shorts',
  shortCreateLimiter,
  celebrate({ [Segments.BODY]: urlSchema() }),
  ShortenController.create,
);

routes.delete(
  '/shorts/:hash',
  shortDeleteLimiter,
  celebrate({ [Segments.PARAMS]: hashSchema() }),
  ShortenController.delete,
);

export default routes;
