import { Router } from 'express';

import { MainController } from './controllers/main.controller';
import { LinkController } from './controllers/link.controller';

const routes = Router();

const mainController = new MainController();
const linkController = new LinkController();

routes.get('/', mainController.version);
routes.get('/:hash', linkController.redirect);

routes.get('/api/links/format/:hash', linkController.format);
routes.get('/api/links/qrcode/:hash', linkController.qrcode);
routes.post('/api/links', linkController.create);

export { routes };

/*
 Middleware de redirecionamento (a partir de parâmetros query/modificadores)
 deve recever o path de destino (/api/links/qrcode/:hash)
*/
