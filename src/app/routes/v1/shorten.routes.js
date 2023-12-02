import { Router } from 'express';
import ShortenController from '../../controllers/ShortenController.js';

const controller = new ShortenController();

const routes = Router();

routes.get('/shorts/:hash/resolve', controller.resolving);
routes.post('/shorts', controller.create);
routes.delete('/shorts/:hash', controller.delete);

export default routes;
