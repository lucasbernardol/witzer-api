import Joi from 'joi';

export const RawOrJson = () =>
  Joi.string()
    .trim()
    .lowercase()
    .valid(...['raw', 'json'])
    .optional()
    .default('json');
