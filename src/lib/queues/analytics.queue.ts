import type { Job, DoneCallback } from 'bull';

import type { AnalyticsQueueData } from '../bull';

import { LinkServices } from '@services/link.services';

export class AnalyticsQueueProcessor {
  public constructor() {}

  static async process(job: Job<AnalyticsQueueData>, done: DoneCallback) {
    try {
      const { hash } = job.data; // sha512

      await LinkServices.fullAnalytics(hash);

      return done(null, { hash });
    } catch (error: any) {
      return done(error);
    }
  }
}
