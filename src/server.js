import process from 'node:process';

import MongoDriver from './modules/mongodb/MongoConnect.js';
import { redisClient } from './modules/redis/client.js';

import { app } from './app.js';

const PORT = Number(process.env?.PORT ?? 3333);

export default async function bootstrap() {
  await MongoDriver.connect();

  await redisClient.connect().then(() => console.log('\nRedis: OK'));

  app.listen(PORT, () => console.log(`\nPORT: ${PORT}`));
}
