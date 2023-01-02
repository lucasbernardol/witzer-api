import type { Request, Response, NextFunction } from 'express';

export interface LinkControllerImplements {
  create(
    request: Request,
    response: Response,
    next: NextFunction
  ): Promise<any>;
}
