import { StatusCodes } from 'http-status-codes';
import AnalyicsServices from '../services/AnalyticService.js';

export default class AnalyticsController {
  /**
   * All redirections
   * @param {import('express').Request} request `req` object.
   * @param {import('express').Request} response `res` object.
   * @param {import('express').Request} next next route.
   * @returns
   */
  async total(request, response, next) {
    try {
      const { redirectings } = await AnalyicsServices.totalWithCache();

      return response.status(StatusCodes.OK).json({ redirectings });
    } catch (error) {
      return next(error);
    }
  }
}
