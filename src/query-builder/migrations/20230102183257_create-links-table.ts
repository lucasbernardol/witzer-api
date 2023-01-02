import { Knex } from 'knex';
import tableNames from '../../constants/table-names.constants';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable(tableNames.link, (table) => {
    table
      .uuid('id')
      .unique()
      .primary()
      .defaultTo(knex.raw('uuid_generate_v4()'));

    table.string('href', 2048).notNullable();
    table.string('hash', 16).unique().notNullable();
    table.string('slug').unique().nullable().defaultTo(null);

    table.integer('redirectings').notNullable().defaultTo(0);
    table.bigint('activated_at').nullable().defaultTo(null);

    table.timestamps(true, true, false);
    table.timestamp('deleted_at').nullable().defaultTo(null);
    table.bigint('_version').notNullable().defaultTo(1);
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable(tableNames.link);
}
