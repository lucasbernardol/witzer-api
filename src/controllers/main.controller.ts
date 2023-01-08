import { Request, Response, NextFunction } from 'express';
import type { MainControllerInterfaces } from './interfaces/main-controller.interface';

import { StatusCodes } from 'http-status-codes';

import { LinkServices } from '@services/link.services';
import { qrcodeHash } from '@utils/qrcode.util';
import type { HashProcessOutput } from '../app.middlewares';

enum TYPES {
  JSON = 'json',
  RAW = 'raw',
}

function isTypes(type: string, key: keyof typeof TYPES = 'JSON') {
  return TYPES[key] === type?.toLowerCase();
}

export class MainController implements MainControllerInterfaces {
  public constructor() {}

  async format(request: Request, response: Response, next: NextFunction) {
    try {
      const { hash } = request.params as { hash: string };

      const query = request.query as { type: string };

      const queryResponseTyped = query?.type || TYPES['RAW'];

      const { href, ...deepEntity } = await LinkServices.withHash(hash);

      if (isTypes(queryResponseTyped) /* JON */) {
        response.status(StatusCodes.OK).json({ href });
        // return
      } else {
        response.status(StatusCodes.OK).send(href);
      }

      await LinkServices.analytics(deepEntity.hash, deepEntity as any);
    } catch (error) {
      return next(error);
    }
  }

  async resolves(request: Request, response: Response, next: NextFunction) {
    try {
      const { hash } = request.params as { hash: string }; // sha256

      const { href, ...deepEntity } = await LinkServices.withHash(hash);

      response.status(StatusCodes.MOVED_PERMANENTLY).redirect(href);

      await LinkServices.analytics(hash, deepEntity as any);
    } catch (error) {
      return next(error);
    }
  }

  async create(request: Request, response: Response, next: NextFunction) {
    try {
      const { href } = request.body as { href: string };

      const { hash, plain } = request?.code as HashProcessOutput; // sha512

      await LinkServices.create({ href, hash });

      return response.status(StatusCodes.CREATED).json({ href, hash: plain });
    } catch (error) {
      return next(error);
    }
  }

  async qrcode(request: Request, response: Response, next: NextFunction) {
    try {
      const { hash } = request.params as { hash: string }; // plain/text

      // verificar se existe um registro
      // gerar qrcode baseado no hash (plain text) recebido
      await LinkServices.hasThrows(hash);

      const qrcode = await qrcodeHash(hash);

      // Content-type: 'image/png'
      response.type('image/png');

      return response.status(StatusCodes.OK).send(qrcode);
    } catch (error) {
      return next(error);
    }
  }
}
