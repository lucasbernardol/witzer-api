import Knex from 'knex';

// @ts-ignore
import config from '../../knexfile'; // add URI STRING

const knex = Knex(config.development);

export { knex };
