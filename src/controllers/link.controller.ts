import { Request, Response, NextFunction } from 'express';
import type { LinkControllerImplements } from './interfaces/link-controller.interface';

import type { PartialModelObject } from 'objection';
import { StatusCodes } from 'http-status-codes';

import { Link } from '../models/link.model';

import type { HashProcessOutput } from '../app.middlewares';

import { createHash } from '../utils/crypto/hash.util';
import { slugified } from '../utils/slugify.util';
import { reply } from '../utils/reply.util';

export class LinkController implements LinkControllerImplements {
  public constructor() {}

  async format(request: Request, response: Response, next: NextFunction) {
    try {
      const { hash } = request.params as { hash: string };

      const queries = request.query as { type: string };

      const queryResponseType = queries?.type || 'raw';

      const link = await Link.query()
        .findOne({ hash: createHash(hash) })
        .select(['id', 'href', 'redirectings', '_version']);

      if (!link) {
        return response
          .status(StatusCodes.NOT_FOUND)
          .json({ message: 'Not found', hash });
      }

      if (queryResponseType?.toLowerCase() === 'json') {
        const { href } = link as { href: string };

        return response.status(StatusCodes.OK).json({ href, hash });
      }

      response.type('tex/plain');

      return response.status(StatusCodes.OK).send(link.href);
    } catch (error) {
      return next(error);
    }
  }

  async redirect(request: Request, response: Response, next: NextFunction) {
    try {
      const { hash } = request.params as { hash: string };

      const _where: PartialModelObject<Link> = { hash, deleted_at: null };

      const _fields = Link.whitelist();

      const link = await Link.query()
        .select(_fields)
        .where(_where)
        .orWhere({ slug: hash, deleted_at: null })
        .first()
        .execute();

      if (!link /* falsy */) {
        const status = StatusCodes.NOT_FOUND;

        return response.status(status).json({ message: 'Link not found' });
      }

      // Redirect to href
      response.status(StatusCodes.MOVED_PERMANENTLY).redirect(link.href);

      const staged: PartialModelObject<Link> = {
        activated_at: Date.now(),
        redirectings: link.redirectings + 1,
        _version: Number.parseInt(link._version as any, 10) + 1,
      };

      await Link.query().update(staged).where(_where).orWhere(_where).execute();
    } catch (error) {
      return next(error);
    }
  }

  async create(request: Request, response: Response, next: NextFunction) {
    try {
      const { href, slug } = request.body as { href: string; slug: string };

      const { plain, hash } = request?.code as HashProcessOutput;

      const plainSlugWithoutHashing: string = slugified(slug);

      const slugHashed = createHash(plainSlugWithoutHashing); // sha256

      /**
       * - Model save "links" using Objection/Knex.
       */
      await Link.query().insert({ href, hash, slug: slugHashed }).execute();

      const stated: PartialModelObject<Link> = {
        href,
        hash: plain,
        slug: plainSlugWithoutHashing,
      };

      return response.status(StatusCodes.CREATED).json(reply(stated));
    } catch (error) {
      return next(error);
    }
  }

  async qrcode(request: Request, response: Response, next: NextFunction) {
    try {
			const { hash } = request.params as { hash: string };

			const hashed = createHash(hash);

			return response.status(StatusCodes.OK).json({ type: 'qrcode', hashed });
		} catch (error) { return next(error) } // prettier-ignore
  }
}
