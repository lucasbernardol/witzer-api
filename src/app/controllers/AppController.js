import { StatusCodes } from 'http-status-codes';
import pkg from '../utils/package.js';

export class AppController {
  /**
   * Current api version
   * @param {import('express').Request} request `req` object.
   * @param {import('express').Response} response `res` object.
   * @param {import('express').NextFunction} next next route.
   * @returns
   */
  async version(request, response, next) {
    try {
      const { version } = pkg;

      return response.status(StatusCodes.OK).json({ version });
    } catch (error) {
      return next(error);
    }
  }
}

export default new AppController();
