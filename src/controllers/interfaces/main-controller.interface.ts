import type { Request, Response, NextFunction } from 'express';

export interface MainControllerInterfaces {
  create(
    request: Request,
    response: Response,
    next: NextFunction
  ): Promise<any>;
}
