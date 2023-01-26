import 'dotenv/config';

import process from 'node:process';
import type { Server as HttpServer } from 'node:http';

import { Server } from './server';
import { redisClient } from '@lib/redis';

const PORT = process.env.PORT || 3333;

export async function bootstrap(init = true): Promise<HttpServer> {
  //await redisClient.connect();

  let server: HttpServer | null = null;

  if (init) {
    server = Server.listen(PORT, () => {
      console.log(`\nPORT: ${PORT}`);
    });
  } else {
    server = Server;
  }

  return server as any;
}
