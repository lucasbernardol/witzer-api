import { Router } from 'express';
import ShortenController from '../../controllers/ShortenController.js';

const controller = new ShortenController();

const routes = Router();

routes.get('/shorts/:hash/resolve', controller.resolving);
routes.post('/shorts', controller.create);

export default routes;
