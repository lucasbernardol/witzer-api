import type { Request, Response, NextFunction } from 'express';

export interface MainControllerImplements {
  version(
    request: Request,
    response: Response,
    next: NextFunction
  ): Promise<any>;
}
