import { StatusCodes } from 'http-status-codes';

import { Url } from '../models/Url.js';
import { Analytic } from '../models/Analytic.js';

import { redis } from '../lib/redis.js';

export default class UrlController {
  async create(request, response, next) {
    try {
      const { href: url } = request.body;

      const instance = await Url.create({ href: url });

      await redis.set(instance.hash, JSON.stringify(instance));

      return response.status(StatusCodes.CREATED).json(instance);
    } catch (error) {
      return next(error);
    }
  }

  async redirecting(request, response) {
    try {
      const { hash } = request.params;

      let shortenedUrl = await redis.get(hash);

      if (shortenedUrl) {
        shortenedUrl = JSON.parse(shortenedUrl);
      } else {
        shortenedUrl = await Url.findOne({ hash }).lean().exec();
      }

      await Analytic.create({
        userAgent: request.get('user-agent') ?? 'unknown',
        urlId: shortenedUrl._id,
      });

      await Url.updateOne(
        { hash },
        {
          $inc: {
            redirectings: 1,
          },
        },
      );

      return response
        .status(StatusCodes.MOVED_TEMPORARILY)
        .redirect(shortenedUrl.href);
    } catch (error) {
      return next(error);
    }
  }
}
