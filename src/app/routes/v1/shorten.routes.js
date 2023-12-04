import { Router } from 'express';
import ShortenController from '../../controllers/ShortenController.js';

const controller = new ShortenController();

const routes = Router();

routes.get('/shorts/:hash/views', controller.views);
routes.get('/shorts/:hash/resolving', controller.resolving); // get long url
routes.get('/shorts/:hash/redirecting', controller.redirecting); // redirecting

routes.post('/shorts', controller.create);
routes.delete('/shorts/:hash', controller.delete);

export default routes;
