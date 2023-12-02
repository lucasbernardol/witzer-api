import { StatusCodes } from 'http-status-codes';

import { ShortenService } from '../services/ShortenService.js';

export default class ShortenController {
  async create(request, response) {
    try {
      const { href } = request.body;

      const services = new ShortenService();

      const shorten = await services.create({ href });

      return response.status(StatusCodes.CREATED).json(shorten);
    } catch (error) {
      return next(error);
    }
  }

  async resolving(request, response, next) {
    const { hash } = request.params;

    const format = request.query?.format ?? 'json';

    const userAgent = request.get('user-agent') ?? 'unknown';

    try {
      const services = new ShortenService();

      const href = await services.resolving({ hash, userAgent });

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
    const { hash } = request.params;

    try {
      const services = new ShortenService();

      await services.delete({ hash });

      return response.status(StatusCodes.NO_CONTENT).end();
    } catch (error) {
      return next(error);
    }
  }
}
