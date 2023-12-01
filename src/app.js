import express from 'express';
import cors from 'cors';

import helmet from 'helmet';
import morgan from 'morgan';

export const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(helmet());
app.use(cors());

app.use(morgan('dev'));
