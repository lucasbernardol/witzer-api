import Bull from 'bull';

import { AnalyticsQueueProcessor } from './queues/analytics.queue';

const ANALYTICS_QUEUE_NAME = 'ANALYTICS_QUEUE' as const;

export type AnalyticsQueueData = {
  hash: string;
};

export const analyticsQueue = new Bull<AnalyticsQueueData>(
  ANALYTICS_QUEUE_NAME,
  {
    redis: {
      host: process.env.REDIS_HOST,
      port: Number(process.env.REDIS_PORT) || 6379,
      username: process.env.REDIS_USERNAME,
      password: process.env.REDIS_PASSWORD,
      tls:
        process.env.REDIS_HOST !== 'localhost' &&
        process.env.REDIS_HOST !== '127.0.0.1'
          ? {
              host: process.env.REDIS_HOST,
            }
          : undefined,
    },
  }
); // @localhost

analyticsQueue.process((job, callback) =>
  AnalyticsQueueProcessor.process(job, callback)
);

analyticsQueue.on('completed', async (job, result) => {
  await job.remove();

  //console.log(result);
});

analyticsQueue.on('failed', console.error);
analyticsQueue.on('error', console.error);
