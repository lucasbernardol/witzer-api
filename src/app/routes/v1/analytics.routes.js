import { Router } from 'express';
import AnalyticsController from '../../controllers/AnalyticsController.js';

const routes = Router();

routes.get('/analytics', AnalyticsController.analytics);

export default routes;
