import type { RequestHandler } from 'express';

import { InternalServerError } from 'http-errors';
import { nanoid } from 'nanoid/async';

import { Link } from './models/link.model';
import { createHashSha512 } from './utils/crypto/hash.util';

export type HashProcessOutput = {
  hash: string;
  plain: string;
};

type HashGenerateMiddlewareFunction = () => RequestHandler;

export const hash: HashGenerateMiddlewareFunction = () => {
  const HASH_LENGHT: number = 7;

  let repeats: number = 0;

  async function processHashes(): Promise<HashProcessOutput> {
    const plain = await nanoid(HASH_LENGHT);

    const hash = createHashSha512(plain);

    const columns: Readonly<string[]> = ['id'];

    const query = Link.query(); // Objection query builder

    const hasRecords = await query.findOne({ hash }).select(columns).execute();

    if (hasRecords) {
      if (repeats > 3) {
        repeats = 0;
        throw new InternalServerError(); // Duplicated keys!
      }

      repeats += 1;
      return processHashes();
    } else {
      repeats = 0;

      return { hash, plain };
    }
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
