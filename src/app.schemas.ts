import Joi from 'joi';

import {
  celebrate as requestValidator,
  Modes,
  SchemaOptions,
  Segments,
} from 'celebrate';

import { sha512 } from '@utils/crypto/sha-512.util';
import { isURL } from '@utils/url.util';

export function celebrate(schema: SchemaOptions) {
  return requestValidator(schema, { abortEarly: true }, { mode: Modes.FULL });
}

const syncHashTransform = (value: any, helpers: Joi.CustomHelpers<string>) => {
  return sha512(value as string);
};

const syncURLTransform = (value: any, helpers: Joi.CustomHelpers<any>) => {
  if (isURL(value)) {
    return value;
  }

  // Joi custom error;
  return helpers.message({
    custom: '"href" is not URL or blocked domain.',
  });
};

export const HASH_PLAIN: Readonly<SchemaOptions> = {
  [Segments.PARAMS]: Joi.object({
    hash: Joi.string().min(8).max(8).required(), // ignore "sha512" converton.
  }),
};

export const HASH: Readonly<SchemaOptions> = {
  [Segments.PARAMS]: Joi.object({
    hash: Joi.string().min(8).max(8).required().custom(syncHashTransform),
  }),
};

export const BODY: Readonly<SchemaOptions> = {
  [Segments.BODY]: Joi.object({
    href: Joi.string()
      .min(8)
      .max(2048)
      .trim()
      .required()
      .custom(syncURLTransform),
  }),
};
