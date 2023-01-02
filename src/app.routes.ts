import { Router } from 'express';
import { reply } from './utils/reply.util';

const routes = Router();

routes.get('/', async (_, response) => response.json(reply()));

export { routes };
