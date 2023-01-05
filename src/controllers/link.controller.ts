import { Request, Response, NextFunction } from 'express';
import type { LinkControllerImplements } from './interfaces/link-controller.interface';

import { PartialModelObject } from 'objection';
import { StatusCodes } from 'http-status-codes';

import { nanoid } from 'nanoid';

import { Link } from '../models/link.model';

import { createHash } from '../utils/crypto/hash.util';
import { mapper } from '../utils/mapper.util';
import { reply } from '../utils/reply.util';

export class LinkController implements LinkControllerImplements {
  public constructor() {}

  async format(request: Request, response: Response, next: NextFunction) {
    try {
      const { hash } = request.params as { hash: string };

      const queries = request.query as { type: string };

      const queryResponseType = queries?.type || 'raw';

      const link = await Link.query()
        .findOne({ hash })
        .select(['id', 'href', 'redirectings', '_version']);

      if (!link) {
        return response
          .status(StatusCodes.NOT_FOUND)
          .json({ message: 'Not found', hash });
      }

      if (queryResponseType?.toLowerCase() === 'json') {
        const { href } = link as { href: string };

        return response.status(StatusCodes.OK).json({ href, hash });
      } else if (queryResponseType.toLowerCase() == 'qrcode') {
        return response.redirect(`/api/links/qrcode/${hash}`);
      }

      return response.status(StatusCodes.OK).send(link.href);
    } catch (error) {
      return next(error);
    }
  }

  async redirect(request: Request, response: Response, next: NextFunction) {
    try {
      const { hash } = request.params as { hash: string };

      const _fields = Link.whitelist();

      const _where: PartialModelObject<Link> = { hash, deleted_at: null };

      const link = await Link.query().findOne(_where).select(_fields).execute();

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

      await Link.query().update(staged).where(_where).execute();
    } catch (error) {
      return next(error);
    }
  }

  async create(request: Request, response: Response, next: NextFunction) {
    try {
      const { href } = request.body as { href: string };

      const staged: PartialModelObject<Link> = {
        href,
        hash: nanoid(7),
      };

      const link = await Link.query().insert(staged).execute();

      return response.status(StatusCodes.CREATED).json(reply(mapper(link)));
    } catch (error) {
      return next(error);
    }
  }

  async qrcode(request: Request, response: Response, next: NextFunction) {
    try {
			const { hash } = request.params as { hash: string }; 

			console.log(createHash(hash))

			return response.status(StatusCodes.OK).json({ type: 'qrcode', hash });
		} catch (error) { return next(error) } // prettier-ignore
  }
}
