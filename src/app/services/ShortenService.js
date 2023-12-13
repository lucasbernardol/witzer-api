import mongoose from 'mongoose';
import HttpErrors from 'http-errors';

import AnalyticServices from './AnalyticService.js';
import { Shorten } from '../models/Shorten.js';

import { redisClient } from '../../modules/redis/client.js';
import redisConstants from '../../common/constants/redis.js';

import { unix } from '../utils/date.js';

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
    const { _id, href, hash } = await Shorten.create({
      href: shorten.href,
    });

    await redisClient.set(
      hash,
      JSON.stringify({
        _id,
        href,
        hash,
      }),
      { EX: redisConstants.createShortenExpiresIn },
    );

    return { href, hash };
  }

  async resolving({ hash, userAgent }) {
    const fields = this.#allowFields;

    let short = await redisClient.get(hash);

    if (!short) {
      const currentShort = await Shorten.findOne({ hash })
        .select(fields)
        .lean();

      if (!currentShort) {
        throw new BadRequest('Shorten not found! Try again later.');
      }

      await redisClient.set(hash, JSON.stringify(currentShort), {
        EX: redisConstants.createShortenExpiresIn,
      });

      short = currentShort;
    } else {
      short = JSON.parse(short);
    }

    // const shorten = await Shorten.findOne({ hash }).select(fields).lean();

    // if (!shorten) {
    //   throw new BadRequest('Shorten not found! Try again later.');
    // }

    //console.log(short);

    await this.#analyticsTransaction({
      userAgent,
      shortenId: short._id,
      hash,
    });

    return short.href; // original url
  }

  async findByPk({ hash }) {
    const fields = this.#allowFields;

    const shorten = await redisClient.get(hash);

    if (shorten) {
      return JSON.parse(shorten);
    }

    const currentShorten = await Shorten.findOne({ hash })
      .select(fields)
      .lean()
      .exec();

    if (!currentShorten) {
      throw new BadRequest('Shorten not found! Try again later.');
    }

    await redisClient.set(hash, JSON.stringify(currentShorten), {
      EX: redisConstants.createShortenExpiresIn,
    });

    return currentShorten;
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

    await this.#removeShortenAndViewsFromCachingHook(hash); // remove from caching
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
          visitedAt: unix(),
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

  async #removeShortenAndViewsFromCachingHook(hash) {
    await redisClient.del(this.#viewsCachingKey(hash));

    await redisClient.del(hash);
  }
}

export default new ShortenService(AnalyticServices);
