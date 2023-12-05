import assert from 'node:assert';
import { StatusCodes } from 'http-status-codes';

import pkg from '../../../package.json' assert { type: 'json' };

assert.ok(pkg?.version, '[package.json]');

export default class AppController {
  async version(request, response, next) {
    try {
      const { version } = pkg;

      return response.status(StatusCodes.OK).json({ version });
    } catch (error) {
      return next(error);
    }
  }
}
