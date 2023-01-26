import { Request, Response, NextFunction } from 'express';
import type { ShortenedControllerMethods } from '@controllers/interfaces/shortened-controller.interface';

import { StatusCodes } from 'http-status-codes';
import { LinkServices } from '@services/link.services';

import { redisClient } from '@lib/redis';

import { qrcodeHash } from '@utils/qrcode.util';
import { cacheKey } from '@utils/cache.util';
import { reply } from '@utils/reply.util';

enum TYPES {
  JSON = 'json',
  RAW = 'raw',
}

const CONTENT_TYPE = 'image/png' as const;

class ShortenedController implements ShortenedControllerMethods {
  private static instance: ShortenedController;

  private static has(): boolean {
    return !!ShortenedController.instance;
  }

  static get(): ShortenedController {
    const hasNoShortenedControllerInstances = !this.has();

    if (hasNoShortenedControllerInstances) {
      this.instance = new ShortenedController();
    }

    return ShortenedController.instance;
  }

  /**
   * @description ShortenedController `constructor` method/function.
   * @private constructor
   */
  private constructor() {}

  /**
   * @description Redirect/redirectings to original URL with received hash/code.
   *
   * @param {Request} request Express.js Request/IncomingMessage object.
   * @param {Response} response Express.js response object.
   * @param {NextFunction} next Next function/method.
   * @returns
   */
  async redirectings(request: Request, response: Response, next: NextFunction) {
    try {
      const { hash } = request.params as { hash: string }; // sha256

      const { href } = await LinkServices.withHash(hash);

      // Redis cache (10 minutes)
      await redisClient.set(cacheKey(request), href, 'EX', 10 * 60);

      return response.status(StatusCodes.MOVED_PERMANENTLY).redirect(href);
    } catch (error) {
      return next(error);
    }
  }

  async format(request: Request, response: Response, next: NextFunction) {
    try {
      const { hash } = request.params as { hash: string }; // sha512

      const query = request.query as { type: string };

      const { href } = await LinkServices.withHash(hash);

      if (query?.type === TYPES['JSON']) {
        return response.status(StatusCodes.OK).json({ href });
      }

      return response.status(StatusCodes.OK).send(href);
    } catch (error) {
      return next(error);
    }
  }

  /**
   * @description Shorting any URL.
   *
   * @param {Request} request Express.js Request/IncomingMessage object.
   * @param {Response} response Express.js response object.
   * @param {NextFunction} next Next function/method.
   * @returns
   */
  async create(request: Request, response: Response, next: NextFunction) {
    try {
      const { href } = request.body as { href: string };

      const shortened = await LinkServices.create({ href });

      return response.status(StatusCodes.CREATED).json(reply(shortened));
    } catch (error) {
      return next(error);
    }
  }

  async qrcode(request: Request, response: Response, next: NextFunction) {
    try {
      const { hash } = request.params as { hash: string }; /* plain/text */

      await LinkServices.hasWithPlainHashOrThrows(hash);

      const qrcode = await qrcodeHash(hash);

      return response.status(StatusCodes.OK).type(CONTENT_TYPE).send(qrcode);
    } catch (error) {
      return next(error);
    }
  }
}

const shortenedController = ShortenedController.get();

export { shortenedController as ShortenedController };
