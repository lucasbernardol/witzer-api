import type { Request, Response, NextFunction } from 'express';

import { StatusCodes } from 'http-status-codes';

import { analyticsQueue } from '@lib/bull';

import { redisClient } from '@lib/redis';
import { cacheKey } from '@utils/cache.util';

export function cacheMiddleware() {
  return async (request: Request, response: Response, next: NextFunction) => {
    try {
      const { hash } = request.params as { hash: string };

      const href = (await redisClient.get(cacheKey(request))) as string;

      if (href) {
        await analyticsQueue.add({ hash }, { attempts: 5, delay: 1000 });

        return response.status(StatusCodes.OK).redirect(href);
      }

      return next();
    } catch (error: any) {
      return next(error);
    }
  };
}
