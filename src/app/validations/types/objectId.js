import Joi from 'joi';
import { isValidObjectId } from 'mongoose';

export const ObjectId = () =>
  Joi.string()
    .trim()
    .required()
    .custom((value, ctx) => {
      return isValidObjectId(value) ? value : ctx.error('any.invalid');
    }, 'Check if value is a valid ObjectId');
