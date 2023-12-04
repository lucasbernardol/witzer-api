import { Analytic } from '../models/Analytic.js';

export class AnalyticService {
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
  }

  async removeManyByShorten({ shortenId }) {
    await Analytic.deleteMany({
      shortenId,
    });
  }
}

export default new AnalyticService();
