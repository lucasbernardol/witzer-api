import 'dotenv/config';

import path from 'node:path';
import type { Knex } from 'knex';

type KnexConfig = {
  [key: string]: Knex.Config;
};

export default <KnexConfig>{
  development: {
    client: 'postgresql',
    connection: {
      charset: 'utf-8',
      host: process.env.DATABASE_HOST,
      port: Number.parseInt(process.env.DATABASE_PORT as any, 10) || 5432,
      database: process.env.DATABASE_NAME,
      user: process.env.DATABASE_USERNAME,
      password: process.env.DATABASE_PASSWORD,
    },
    pool: {
      min: 2,
      max: 10,
    },
    migrations: {
      tableName: 'migrations',
      directory: path.resolve(__dirname, 'src', 'query-builder', 'migrations'),
      extension: 'ts',
    },

    seeds: {
      directory: path.resolve(__dirname, 'src', 'query-builder', 'seeds'),
      extension: 'ts',
      timestampFilenamePrefix: true,
    },
  },

  /*
  staging: {
    client: 'postgresql',
    connection: {
      database: 'my_db',
      user: 'username',
      password: 'password',
    },
    pool: {
      min: 2,
      max: 10,
    },
    migrations: {
      tableName: 'knex_migrations',
    },
  }, */

  /* 
  production: {
    client: "postgresql",
    connection: {
      database: "my_db",
      user: "username",
      password: "password"
    },
    pool: {
      min: 2,
      max: 10
    },
    migrations: {
      tableName: "knex_migrations"
    }
  } */
};
