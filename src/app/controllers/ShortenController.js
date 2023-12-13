import { StatusCodes } from 'http-status-codes';
import ShortenServices from '../services/ShortenService.js';

export class ShortenController {
  /**
   * Total views
   * @param {import('express').Request} request `req` object.
   * @param {import('express').Response} response `res` object.
   * @param {import('express').NextFunction} next next route.
   * @returns
   */
  async views(request, response, next) {
    try {
      const { hash } = request.params;

      const { views } = await ShortenServices.views({ hash });

      return response.status(StatusCodes.OK).json({ views });
    } catch (error) {
      return next(error);
    }
  }

  /**
   * Get a single Shorten.
   * @param {import('express').Request} request `req` object.
   * @param {import('express').Response} response `res` object.
   * @param {import('express').NextFunction} next next route.
   * @returns
   */
  async findByPK(request, response, next) {
    try {
      const { hash } = request.params;

      const shorten = await ShortenServices.findByPk({ hash });

      return response.status(StatusCodes.OK).json(shorten);
    } catch (error) {
      return next(error);
    }
  }

  /**
   * Redirecting
   * @param {import('express').Request} request `req` object.
   * @param {import('express').Response} response `res` object.
   * @param {import('express').NextFunction} next next route.
   * @returns
   */
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

  async create(request, response, next) {
    try {
      const { href } = request.body;

      const shorten = await ShortenServices.create({ href });

      return response.status(StatusCodes.CREATED).json(shorten);
    } catch (error) {
      return next(error);
    }
  }

  /**
   * Remove a Shorten
   * @param {import('express').Request} request `req` object.
   * @param {import('express').Response} response `res` object.
   * @param {import('express').NextFunction} next next route.
   * @returns
   */
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

export default new ShortenController();
