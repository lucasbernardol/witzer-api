import mongoose from 'mongoose';

import { Shorten } from '../models/Shorten.js';
import { Analytic } from '../models/Analytic.js';

export class ShortenService {
  #allowFields = ['_id', 'href', 'hash'];

  async create({ href }) {
    const instance = await Shorten.create({
      href,
    });

    return {
      href: instance.href,
      hash: instance.hash,
    };
  }

  async resolving({ hash, userAgent }) {
    const fields = this.#allowFields;

    const shorten = await Shorten.findOne({ hash }).select(fields).lean();

    if (!shorten) {
      throw new Error('Shorten not found');
    }

    await this.#analyticsTransaction({
      userAgent,
      shortenId: shorten._id,
    });

    return shorten.href; // original url
  }

  async delete({ hash }) {
    const shorten = await Shorten.findOne({ hash }).select(['_id']).exec();

    if (!shorten) {
      throw new Error('Shorten not found.');
    }

    const shortenId = shorten._id;

    await Shorten.deleteOne({ _id: shortenId });

    await Analytic.deleteMany({ shortenId }); // Cascading remove
  }

  async #analyticsTransaction({ shortenId, userAgent }) {
    // Clicks
    const session = await mongoose.connection.startSession();

    await session.withTransaction(async () => {
      await Analytic.create(
        [
          {
            userAgent,
            shortenId,
          },
        ],
        {
          session,
        },
      );

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

    //*await session.commitTransaction();
    await session.endSession();
  }
}

export default new ShortenService();
