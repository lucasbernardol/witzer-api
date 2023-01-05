import process from 'node:process';

import Knex from 'knex';
import { Model } from 'objection';

const knex = Knex({
  client: process.env.DATABASE_TYPE,
  connection: {
    charset: 'utf-8',
    connectionString: process.env.DATABASE_URI,
  },
  debug: true,
  log: {
    debug: console.log,
  },
});

Model.knex(knex);

export { knex };
