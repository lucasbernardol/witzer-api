import express from 'express';
import compression from 'compression';

import helmet from 'helmet';
import cors from 'cors';

import morgan from 'morgan';
import hpp from 'hpp';

import { routes } from './app.routes';

export const app = express();

app.use(compression());

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(helmet());
app.use(cors());

app.use(
  hpp({
    checkBody: false,
    checkQuery: true,
  })
);

app.use(morgan('dev'));
app.use(routes);

app.enable('trust proxy');
