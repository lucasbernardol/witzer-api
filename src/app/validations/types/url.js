import process from 'node:process';
import Joi from 'joi';
import isURL from 'validator/lib/isURL.js';

export const Url = () =>
  Joi.string()
    .min(8)
    .max(2048)
    .trim()
    .required()
    .custom((value, ctx) => {
      const isValidUrl = isURL(value, {
        validate_length: false,
        protocols: ['https', 'http'],
        host_blacklist: [
          'localhost',
          '127.0.0.1',
          'https:127.0.0.1',
          process.env.HOST,
        ],
      });

      return isValidUrl ? value : ctx.error('any.invalid');
    });
