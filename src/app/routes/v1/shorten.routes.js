import { Router } from 'express';
import ShortenController from '../../controllers/ShortenController.js';

const controller = new ShortenController();

const router = Router();

export default router;
