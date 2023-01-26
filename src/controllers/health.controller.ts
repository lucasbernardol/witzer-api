import assert from 'node:assert/strict';

import type { Request, Response, NextFunction } from 'express';
import type { HealthControllerMethods } from '@controllers/interfaces/health-controller.interface';

import { StatusCodes } from 'http-status-codes';

// @ts-ignore
import packages from '../../package.json';

assert.ok(packages?.version);

class HealthController implements HealthControllerMethods {
  private static instance: HealthController;

  private static has(): boolean {
    return !!this.instance;
  }

  static get(): HealthController {
    const hasNoHealthControllerInstance = !this.has();

    if (hasNoHealthControllerInstance) {
      // Hack: new this();
      this.instance = new HealthController();
    }

    return HealthController.instance;
  }

  /**
   * @description HealthController `constructor` method/function.
   * @private constructor
   */
  private constructor() {}

  async stats(_: Request, response: Response, next: NextFunction) {
    try {
			const { version } = packages as { version: string };

		  return response.status(StatusCodes.OK).json({ version });
    } catch (error: any) { return next(error) } // prettier-ignore
  }
}

const healthController = HealthController.get();

export { healthController as HealthController };
