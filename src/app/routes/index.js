import { Router } from 'express';

import UrlRouter from './v1/url.routes.js';

const routes = Router();

routes.use('/api/v1', UrlRouter);

export { routes };
