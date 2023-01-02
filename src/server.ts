import { createServer } from 'node:http';
import type { Server } from 'node:http';

import './query-builder/knex';
import { app } from './app';

export const server: Server = createServer(app);
