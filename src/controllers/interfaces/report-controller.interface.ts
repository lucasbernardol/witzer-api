import type { Request, Response, NextFunction } from 'express';

export interface ReportViolationControllerMethods {
  csp(request: Request, response: Response, next: NextFunction): Promise<any>;
}
