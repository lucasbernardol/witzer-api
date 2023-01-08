import type { Request, Response, NextFunction } from 'express';
import type { HealthControllerInterfaces } from '@controllers/interfaces/health-controller.interface';

import { StatusCodes } from 'http-status-codes';

import { reply } from '@utils/reply.util';
import { LinkServices } from '@services/link.services';

export class HealthController implements HealthControllerInterfaces {
  public constructor() {}

  async stats(request: Request, response: Response, next: NextFunction) {
    try {
      const stats = await LinkServices.stats();

      const statistics: number = Number.parseInt(stats, 10);

      return response.status(StatusCodes.OK).json(reply({ statistics }));
    } catch (error) {
      return next(error);
    }
  }

  async version(_: Request, response: Response, next: NextFunction) {
    try {
		  return response.status(StatusCodes.OK).json(reply());
    } catch (error: any) { return next(error) } // prettier-ignore
  }
}
