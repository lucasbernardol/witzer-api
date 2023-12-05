import Joi from 'joi';

import constants from '../../../common/constants/nanoid.js';

export const NanoId = () =>
  Joi.string()
    .min(constants.length)
    .max(constants.length)
    .trim()
    .alphanum()
    .required();
