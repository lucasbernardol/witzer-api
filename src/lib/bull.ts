import Bull from 'bull';

import { AnalyticsQueueProcessor } from './queues/analytics.queue';

const ANALYTICS_QUEUE_NAME = 'ANALYTICS_QUEUE' as const;

export type AnalyticsQueueData = {
  hash: string;
};

export const analyticsQueue = new Bull<AnalyticsQueueData>(
  ANALYTICS_QUEUE_NAME
); // @localhost

analyticsQueue.process((job, callback) =>
  AnalyticsQueueProcessor.process(job, callback)
);

analyticsQueue.on('completed', async (job, result) => {
  await job.remove();

  console.log(result);
});

analyticsQueue.on('failed', console.error);
analyticsQueue.on('error', console.error);
