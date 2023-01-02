import process from 'node:process';
import Knex from 'knex';

const knex = Knex({
  client: process.env.DATABASE_TYPE,
  connection: {
    charset: 'utf-8',
    connectionString: process.env.DATABASE_URI,
  },
});

export { knex };
