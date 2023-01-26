import type { Request, Response, NextFunction } from 'express';

export interface HealthControllerMethods {
  stats(request: Request, response: Response, next: NextFunction): Promise<any>;
}
