import { createServer } from 'node:http';
import type { Server } from 'node:http';

import { app } from './app';

export const server: Server = createServer(app);
