import type { RequestHandler } from 'express';
import { nanoid } from 'nanoid/async';

import { Link } from './models/link.model';
import { createHash } from './utils/crypto/hash.util';

export type HashProcessOutput = {
  hash: string;
  plain: string;
};

type HashGenerateMiddlewareFunction = () => RequestHandler;

export const hashMiddleware: HashGenerateMiddlewareFunction = () => {
  const HASH_LENGHT: number = 7;

  let repeats: number = 0;

  async function processHashes(): Promise<HashProcessOutput> {
    const nanoidPlainText = await nanoid(HASH_LENGHT);

    const hash = createHash(nanoidPlainText); // sha256

    const isLinkRecord = await Link.query()
      .findOne({ hash })
      .select(['id'])
      .execute();

    if (isLinkRecord) {
      if (repeats < 3) {
        throw new Error('hash error, try again later.');
      }

      repeats += 1;
      return processHashes();
    }

    return { hash, plain: nanoidPlainText };
  }

  return async (request, response, next) => {
    try {
      const { plain, hash } = await processHashes();

      request.code = {
        hash,
        plain,
      };

      return next();
    } catch (error) {
      return next(error);
    }
  };
};
