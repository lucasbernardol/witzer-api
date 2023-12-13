import { StatusCodes } from 'http-status-codes';
import AnalyicsServices from '../services/AnalyticService.js';

export class AnalyticsController {
  /**
   * All redirections
   * @param {import('express').Request} request `req` object.
   * @param {import('express').Response} response `res` object.
   * @param {import('express').NextFunction} next next route.
   * @returns
   */
  async analytics(request, response, next) {
    try {
      const { redirectings } = await AnalyicsServices.totalWithCache();

      return response.status(StatusCodes.OK).json({ redirectings });
    } catch (error) {
      return next(error);
    }
  }
}

export default new AnalyticsController();
