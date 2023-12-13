import { Analytic } from '../models/Analytic.js';

import { redisClient } from '../../modules/redis/client.js';
import redisConstants from '../../common/constants/redis.js';

export class AnalyticService {
  #totalCachekey = 'analytics:total';

  get cacheKey() {
    return this.#totalCachekey;
  }

  async totalWithCache() {
    const totalRedirectings = await redisClient.get(this.cacheKey);

    if (totalRedirectings) {
      return {
        redirectings: Number(totalRedirectings), // convert to number
      };
    }

    const redirectings = await this.#totalDocuments();

    await redisClient.set(this.cacheKey, redirectings.toString(), {
      EX: redisConstants.totalAnalyticExpiresIn,
    });

    return { redirectings };
  }

  async total() {
    const redirectings = await this.#totalDocuments();

    return { redirectings };
  }

  async create(analytic) {
    const { userAgent, shortenId } = analytic; // Props

    const analyticInstance = await Analytic.create({
      userAgent,
      shortenId,
    });

    return analyticInstance;
  }

  async createWithContext(context) {
    const { analytic, session } = context; // Transaction Context.

    const { userAgent, shortenId } = analytic;

    await Analytic.create(
      [
        {
          userAgent,
          shortenId,
        },
      ],
      { session },
    );

    // Update caching if exists
    await this.#incrementAnalyticsCachingHook();
  }

  async removeManyByShorten({ shortenId }) {
    const { deletedCount } = await Analytic.deleteMany({
      shortenId,
    });

    // Reloading total Count
    await this.#realodAnalyticsCachingHook(deletedCount);
  }

  async #totalDocuments() {
    return await Analytic.countDocuments();
  }

  async #realodAnalyticsCachingHook(deletedCount) {
    const currentCacheKey = this.cacheKey;

    const total = await redisClient.get(currentCacheKey);

    if (total) {
      const totalRedirectings = Number(total) - deletedCount;

      await redisClient.set(currentCacheKey, totalRedirectings.toString(), {
        EX: redisConstants.totalAnalyticExpiresIn,
      });
    }
  }

  async #incrementAnalyticsCachingHook() {
    const currentCacheKey = this.cacheKey;

    const isValidCache = await redisClient.exists(currentCacheKey);

    if (isValidCache) {
      await redisClient.incr(currentCacheKey);
    }
  }
}

export default new AnalyticService();
