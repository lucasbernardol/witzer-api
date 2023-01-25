import type { Request, Response, NextFunction } from 'express';
import { StatusCodes } from 'http-status-codes';

import { CSP_REPORT } from '@constants/string.constants';

interface ReportViolationController {
  report(
    request: Request,
    response: Response,
    next: NextFunction
  ): Promise<any>;
}

export class ReportController implements ReportViolationController {
  /**
   * @description ReportController `constructor` method.
   * @public constructor
   */
  public constructor() {}

  async report(request: Request, response: Response, next: NextFunction) {
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
