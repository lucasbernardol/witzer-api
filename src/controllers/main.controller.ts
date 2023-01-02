import type { Request, Response, NextFunction } from 'express';
import type { MainControllerImplements } from './interfaces/main-controller.interface';

import { StatusCodes } from 'http-status-codes';
import { reply } from '../utils/reply.util';

export class MainController implements MainControllerImplements {
  public constructor() {}

  async version(_: Request, response: Response, next: NextFunction) {
    try {
      return response.status(StatusCodes.OK).json(reply());
    } catch (error: any) {
      // Router stack with error.
      return next(error);
    }
  }
}
