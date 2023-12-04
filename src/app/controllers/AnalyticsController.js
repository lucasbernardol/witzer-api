import { StatusCodes } from 'http-status-codes';
import AnalyicsServices from '../services/AnalyticService.js';

export default class AnalyticsController {
  async total(request, response, next) {
    try {
      const { total } = await AnalyicsServices.total();

      return response.status(StatusCodes.OK).json({ total });
    } catch (error) {
      return next(error);
    }
  }
}
