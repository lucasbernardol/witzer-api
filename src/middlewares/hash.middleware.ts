import type { RequestHandler } from 'express';
import { nanoid } from '@utils/nanoid.util';
import { sha512 } from '@utils/crypto/sha-512.util';

type HashingOptions = {
  property: string;
};

export type RequestHashing = {
  plain: string;
  hash: string;
};

type HashGenerateMiddlewareFunction = (
  options?: HashingOptions
) => RequestHandler;

export const hash: HashGenerateMiddlewareFunction = (options) => {
  return async (request, response, next) => {
    try {
      const plain = await nanoid();

      const hash = sha512(plain); // sha512

      request[(options?.property || 'code') as 'code'] = { plain, hash };

      return next();
    } catch (error) {
      return next(error);
    }
  };
};
