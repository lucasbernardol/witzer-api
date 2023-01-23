import { createServer } from 'node:http';
import type { Server as HttpServer } from 'node:http';

import '@query-builder/knex'; // Objection/Knex.js loaders.

import { app } from './app';

export const Server: HttpServer = createServer(app);
