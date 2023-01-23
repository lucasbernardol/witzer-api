import process from 'node:process';
import type { Server as HttpServer } from 'node:http';

import { Server } from './server';

const PORT = process.env.PORT || 3333;

export async function bootstrap(): Promise<HttpServer> {
  const server = Server.listen(PORT, () => {
    console.log(`\nPORT: ${PORT}`);
  });

  return server;
}
