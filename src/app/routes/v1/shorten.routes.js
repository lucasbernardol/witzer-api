import { Router } from 'express';
import { celebrate, Segments } from 'celebrate';

import ShortenController from '../../controllers/ShortenController.js';
import { RawOrJson } from '../../validations/types/format.js';

import { hashSchema } from '../../validations/hashSchema.js';
import { urlSchema } from '../../validations/urlSchema.js';

const controller = new ShortenController();

const routes = Router();

routes.get(
  '/shorts/:hash/views',
  celebrate({ [Segments.PARAMS]: hashSchema() }),
  controller.views,
);

routes.get(
  '/shorts/:hash',
  celebrate({
    [Segments.PARAMS]: hashSchema(),
    [Segments.QUERY]: {
      format: RawOrJson(),
    },
  }),
  controller.resolving,
); // returns original url

routes.post(
  '/shorts',
  celebrate({ [Segments.BODY]: urlSchema() }),
  controller.create,
);

routes.delete(
  '/shorts/:hash',
  celebrate({ [Segments.PARAMS]: hashSchema() }),
  controller.delete,
);

export default routes;
