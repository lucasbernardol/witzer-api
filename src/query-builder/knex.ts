import process from 'node:process';

import { Model } from 'objection';
import Knex from 'knex';

const knex = Knex({
  client: process.env.DATABASE_TYPE,
  connection: {
    charset: 'utf-8',
    connectionString: process.env.DATABASE_URI,
  },
});

Model.knex(knex);

export { knex };
