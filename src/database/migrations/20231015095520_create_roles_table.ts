import { Knex } from 'knex';

const table = 'roles';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable(table, (schema) => {
    schema.increments('id');

    schema.string('name', 127).unique().notNullable();
    schema.enum('type', ['root', 'reserved', 'default']).notNullable().defaultTo('default');
    schema.boolean('is_visible').notNullable().defaultTo(true);

    schema.timestamp('created_at').defaultTo(knex.fn.now());
    schema.timestamp('updated_at').defaultTo(knex.raw('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP'));
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists(table);
}

