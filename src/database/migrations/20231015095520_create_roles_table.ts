import { Knex } from 'knex';

const table = 'roles';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTableIfNotExists(table, (schema) => {
    schema.increments('id');

    schema.string('name', 127).unique().notNullable();
    schema.enum('type', ['root', 'default']).notNullable().defaultTo('default');
    schema.boolean('is_visible').notNullable().defaultTo(true);

    schema.timestamps();
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists(table);
}

