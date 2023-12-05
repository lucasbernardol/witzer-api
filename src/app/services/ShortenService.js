import mongoose from 'mongoose';
import HttpErrors from 'http-errors';

import AnalyticServices from './AnalyticService.js';
import { Shorten } from '../models/Shorten.js';

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
    });

    return shorten.href; // original url
  }

  async views({ hash }) {
    const shorten = await Shorten.findOne({ hash })
      .select(['redirectings'])
      .lean()
      .exec();

    if (!shorten) {
      throw new BadRequest('Shorten not found. Try again later.');
    }

    return shorten.redirectings;
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

  async #analyticsTransaction({ shortenId, userAgent }) {
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
  }

  async #removeManyAnalytics({ shortenId }) {
    await this.analyticServices.removeManyByShorten({ shortenId });
  }
}

export default new ShortenService(AnalyticServices);
