import { Router } from 'express';
import AnalyticsController from '../../controllers/AnalyticsController.js';

const controller = new AnalyticsController();

const routes = Router();

routes.get('/analytics', controller.total);

export default routes;
