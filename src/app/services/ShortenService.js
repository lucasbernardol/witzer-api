import mongoose from 'mongoose';
import HttpErrors from 'http-errors';

import AnalyticServices from './AnalyticService.js';
import { Shorten } from '../models/Shorten.js';

import { redisClient } from '../../modules/redis/client.js';
import redisConstants from '../../common/constants/redis.js';

const { BadRequest } = HttpErrors;

export class ShortenService {
  // prettier-ignore
  #allowFields = [
    '_id', 
    'href', 
    'hash'
  ];

  constructor(analyticServices) {
    this.analyticServices = analyticServices;
  }

  async create(shorten) {
    const { href, hash } = await Shorten.create({
      href: shorten.href,
    });

    return { href, hash };
  }

  async resolving({ hash, userAgent }) {
    const fields = this.#allowFields;

    const shorten = await Shorten.findOne({ hash }).select(fields).lean();

    if (!shorten) {
      throw new BadRequest('Shorten not found! Try again later.');
    }

    await this.#analyticsTransaction({
      userAgent,
      shortenId: shorten._id,
      hash,
    });

    return shorten.href; // original url
  }

  async views({ hash }) {
    const viewsCacheKey = this.#viewsCachingKey(hash);

    const cachingViews = await redisClient.get(viewsCacheKey);

    if (cachingViews) {
      return {
        views: Number(cachingViews),
      };
    }

    const shorten = await Shorten.findOne({ hash })
      .select(['redirectings'])
      .lean()
      .exec();

    if (!shorten) {
      throw new BadRequest('Shorten not found. Try again later.');
    }

    const views = shorten.redirectings;

    await redisClient.set(viewsCacheKey, views, {
      EX: redisConstants.totalAnalyticsHashExpiresIn,
    });

    return { views };
  }

  async delete({ hash }) {
    const shorten = await Shorten.findOne({ hash }).select(['_id']).exec();

    if (!shorten) {
      throw new BadRequest('Shorten not found! Try again later.');
    }

    const shortenId = shorten._id;

    await this.#removeManyAnalytics({ shortenId });

    await Shorten.deleteOne({ _id: shortenId });
  }

  //-- private metthods --

  async #analyticsTransaction({ shortenId, userAgent, hash }) {
    const session = await mongoose.connection.startSession();

    await session.withTransaction(async () => {
      await this.analyticServices.createWithContext({
        analytic: {
          userAgent,
          shortenId,
        },
        session,
      });

      await Shorten.updateOne(
        { _id: shortenId },
        {
          $inc: {
            redirectings: 1,
          },
        },
        {
          session,
        },
      );
    });

    // await session.commitTransaction();
    await session.endSession();

    await this.#viewsCachingHook({ hash });
  }

  async #removeManyAnalytics({ shortenId }) {
    await this.analyticServices.removeManyByShorten({ shortenId });
  }

  #viewsCachingKey(hash) {
    return `views:${hash}`;
  }

  async #viewsCachingHook({ hash }) {
    const currentViewsKey = this.#viewsCachingKey(hash);

    const isValid = await redisClient.exists(currentViewsKey);

    if (isValid) {
      await redisClient.incr(currentViewsKey);
    }
  }
}

export default new ShortenService(AnalyticServices);
