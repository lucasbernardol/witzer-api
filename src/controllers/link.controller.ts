import { Request, Response, NextFunction } from 'express';
import type { LinkControllerImplements } from './interfaces/link-controller.interface';

import { StatusCodes } from 'http-status-codes';
import { nanoid } from 'nanoid';

import { Link } from '../models/link.model';

import { linkMapper } from '../utils/link-mapper';
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

      const query = Link.query();

      const link = await query
        .findOne({ hash })
        .select(['id', 'href', 'redirectings', '_version']);

      if (!link /* falsy */) {
        return response
          .status(StatusCodes.NOT_FOUND)
          .json({ message: 'Link not found', hash });
      }

      // Redirect to href
      response.status(StatusCodes.MOVED_PERMANENTLY).redirect(link.href);

      await Link.query()
        .update({
          activated_at: Date.now(),
          redirectings: link.redirectings + 1,
          _version: link._version + 1,
        })
        .where({ hash });
    } catch (error) {
      return next(error);
    }
  }

  async create(request: Request, response: Response, next: NextFunction) {
    try {
      const { href } = request.body as { href: string };

      const link = await Link.query().insert({
        href,
        hash: nanoid(7),
      });

      const toReply = reply(linkMapper(link));

      return response.status(StatusCodes.CREATED).json(toReply);
    } catch (error) {
      return next(error);
    }
  }

  async qrcode(request: Request, response: Response, next: NextFunction) {
    try {
			const { hash } = request.params as { hash: string }; 

			return response.status(StatusCodes.OK).json({ type: 'qrcode', hash });
		} catch (error) { return next(error) } // prettier-ignore
  }
}
