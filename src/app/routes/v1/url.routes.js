import { Router } from 'express';
import UrlController from '../../controllers/UrlController.js';

const controller = new UrlController();

const router = Router();

router.get('/shorts/:hash', controller.redirecting);
router.post('/shorts', controller.create);

export default router;
