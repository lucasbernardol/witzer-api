import { Joi } from 'celebrate'; // install separated
import { createHashSha512 } from './utils/crypto/hash.util';

const callback = (value: any, helpers: any) => {
  if (!value /* value === null */) {
    return value;
  }

  return createHashSha512(value); // sha512
};

export const hashSchemaWithoutEncoding = Joi.object<{ hash: string }>({
  hash: Joi.string().min(7).max(7).required(),
});

export const hashSchema = Joi.object<{ hash: string }>({
  hash: Joi.string().min(7).max(7).required().custom(callback),
});

export const bodySchema = Joi.object<{ href: string }>({
  href: Joi.string().min(6).max(2048).trim().required(),
});
