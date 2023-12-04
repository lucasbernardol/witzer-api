import { StatusCodes } from 'http-status-codes';

import ShortenServices from '../services/ShortenService.js';

export default class ShortenController {
  async create(request, response, next) {
    try {
      const { href } = request.body;

      const shorten = await ShortenServices.create({ href });

      return response.status(StatusCodes.CREATED).json(shorten);
    } catch (error) {
      return next(error);
    }
  }

  async views(request, response, next) {
    try {
      const { hash } = request.params;

      const views = await ShortenServices.views({ hash });

      return response.status(StatusCodes.OK).json({ views });
    } catch (error) {
      return next(error);
    }
  }

  async redirecting(request, response, next) {
    try {
      const { hash } = request.params;

      const userAgent = request.userAgent; // browser agent or "unknown"

      const href = await ShortenServices.resolving({ hash, userAgent });

      return response.status(StatusCodes.MOVED_TEMPORARILY).redirect(href);
    } catch (error) {
      return next(error);
    }
  }

  async resolving(request, response, next) {
    try {
      const { hash } = request.params;

      const format = request.query?.format ?? 'json';

      const userAgent = request.userAgent;

      const href = await ShortenServices.resolving({ hash, userAgent });

      response.status(StatusCodes.OK);

      if (format.toLowerCase() === 'raw') {
        return response.type('text').send(href);
      }

      return response.json({ href });
    } catch (error) {
      return next(error);
    }
  }

  async delete(request, response, next) {
    try {
      const { hash } = request.params;

      await ShortenServices.delete({ hash });

      return response.status(StatusCodes.NO_CONTENT).end();
    } catch (error) {
      return next(error);
    }
  }
}
