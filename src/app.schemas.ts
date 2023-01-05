import { Joi } from 'celebrate'; // install separated

import { createHash } from './utils/crypto/hash.util';
import { slugified } from './utils/slugify.util';
import { SLUG_REPLECE_CHARS_REGEX } from './constants/regex.constants';

export const hashSchema = Joi.object({
  code: Joi.string()
    .min(7)
    .max(255)
    .custom((value, helpers) => {
      //console.log({ value, helpers });

      return createHash(value); // sha256
    })
    .required(),
});

export const bodySchema = Joi.object({
  href: Joi.string().min(6).max(2048).trim().required(),
  slug: Joi.string()
    .min(7)
    .max(255)
    .replace(SLUG_REPLECE_CHARS_REGEX, '')
    .trim()
    .optional()
    .allow(null)
    .default(null)
    .custom((value, helpers) => {
      if (!value /* value === null */) {
        return value;
      }

      return slugified(value);
    }),
});
