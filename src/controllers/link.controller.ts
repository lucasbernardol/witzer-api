import { Request, Response, NextFunction } from 'express';
import type { LinkControllerImplements } from './interfaces/link-controller.interface';

import { LinkServices } from '../services/link.services';

import type { PartialModelObject } from 'objection';
import { StatusCodes } from 'http-status-codes';

import { Link } from '../models/link.model';

import type { HashProcessOutput } from '../app.middlewares';

import { createHash } from '../utils/crypto/hash.util';
import { slugified } from '../utils/slugify.util';
import { reply } from '../utils/reply.util';

enum TYPES {
  JSON = 'json',
  RAW = 'raw',
}

function isTypes(type: string, key: keyof typeof TYPES = 'JSON') {
  return TYPES[key] === type?.toLowerCase();
}

export class LinkController implements LinkControllerImplements {
  public constructor() {}

  async format(request: Request, response: Response, next: NextFunction) {
    try {
      const { code } = request.params as { code: string }; // sha256

      console.log({ code });

      const query = request.query as { type: string };

      const queryResponseTyped = query?.type || TYPES['RAW'];

      const { href, ...deepEntity } = await LinkServices.withHash(code);

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

  async redirect(request: Request, response: Response, next: NextFunction) {
    try {
      const { code } = request.params as { code: string }; // sha256

      const { href, ...deepEntity } = await LinkServices.withHash(code);

      response.status(StatusCodes.MOVED_PERMANENTLY).redirect(href);

      await LinkServices.analytics(deepEntity.hash, deepEntity as any);
    } catch (error) {
      return next(error);
    }
  }

  async create(request: Request, response: Response, next: NextFunction) {
    try {
      const { href, slug } = request.body as { href: string; slug: string };

      const { plain, hash } = request?.code as HashProcessOutput;

      console.log({ href, slug, plain, hash });
      /*
      const plainSlugWithoutHashing: string = slugified(slug);

      const slugHashed = createHash(plainSlugWithoutHashing); // sha256

    
      await Link.query().insert({ href, hash, slug: slugHashed }).execute();

      const stated: PartialModelObject<Link> = {
        href,
        hash: plain,
        slug: plainSlugWithoutHashing,
      };
      */
      return response.status(StatusCodes.CREATED).json(reply({}));
    } catch (error) {
      return next(error);
    }
  }

  async qrcode(request: Request, response: Response, next: NextFunction) {
    try {
			const { code } = request.params as { code: string };

			const hashed = createHash(code);

			return response.status(StatusCodes.OK).json({ type: 'qrcode', hashed });
		} catch (error) { return next(error) } // prettier-ignore
  }
}
