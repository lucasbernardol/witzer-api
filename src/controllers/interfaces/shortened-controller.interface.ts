import type { Request, Response, NextFunction } from 'express';

export interface ShortenedControllerMethods {
  create(
    request: Request,
    response: Response,
    next: NextFunction
  ): Promise<any>;

  redirectings(
    request: Request,
    response: Response,
    next: NextFunction
  ): Promise<any>;

  qrcode(
    request: Request,
    response: Response,
    next: NextFunction
  ): Promise<any>;

  format(
    request: Request,
    response: Response,
    next: NextFunction
  ): Promise<any>;
}
