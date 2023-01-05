import { Router } from 'express';
import { celebrate } from 'celebrate';

import { MainController } from './controllers/main.controller';
import { LinkController } from './controllers/link.controller';

import { bodySchema, hashSchema } from './app.schemas';
import { hashMiddleware } from './app.middlewares';

const routes = Router();

const mainController = new MainController();
const linkController = new LinkController();

routes.get('/', mainController.version);

routes.get(
  '/:code',
  celebrate({ params: hashSchema }),
  linkController.redirect
);

routes.get(
  '/api/links/format/:code',
  celebrate({ params: hashSchema }),
  linkController.format
);
routes.get(
  '/api/links/qrcode/:code',
  celebrate({ params: hashSchema }),
  linkController.qrcode
);

routes.post(
  '/api/links',
  celebrate({ body: bodySchema }),
  hashMiddleware(),
  linkController.create
);

export { routes };

/*
 Middleware de redirecionamento (a partir de parâmetros query/modificadores)
 deve recever o path de destino (/api/links/qrcode/:hash)
*/
