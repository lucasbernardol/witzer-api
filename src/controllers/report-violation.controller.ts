import type { Request, Response, NextFunction } from 'express';
import type { ReportViolationControllerMethods } from '@controllers/interfaces/report-controller.interface';

import { StatusCodes } from 'http-status-codes';
import { CSP_REPORT } from '@constants/string.constants';

class ReportController implements ReportViolationControllerMethods {
  private static instance: ReportController;

  private static has(): boolean {
    return !!this.instance; /* converts to boolean */
  }

  static get(): ReportController {
    const hasNoReportControllerInstances = !this.has();

    if (hasNoReportControllerInstances) {
      this.instance = new ReportController();
    }

    return ReportController.instance;
  }

  /**
   * @description ReportController `constructor` method.
   * @private constructor
   */
  private constructor() {}

  async csp(request: Request, response: Response, next: NextFunction) {
    try {
      const body = request.body as { [CSP_REPORT]: Record<string, any> };

      const data = body[CSP_REPORT] ? JSON.stringify(body[CSP_REPORT]) : body;

      console.log(data); // logs violation

      return response.status(StatusCodes.NO_CONTENT).end();
    } catch (error: any) {
      return next(error);
    }
  }
}

const reportController = ReportController.get();

export { reportController as ReportController };
