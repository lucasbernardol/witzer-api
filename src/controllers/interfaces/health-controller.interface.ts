import type { Request, Response, NextFunction } from 'express';

export interface HealthControllerInterfaces {
  stats(request: Request, response: Response, next: NextFunction): Promise<any>;
  version(
    request: Request,
    response: Response,
    next: NextFunction
  ): Promise<any>;
}
