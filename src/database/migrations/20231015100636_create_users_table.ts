import { Knex } from 'knex';

const table = 'users';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTableIfNotExists(table, (schema) => {
    schema.increments('id');

    schema.string('name');
    schema.string('email').unique().notNullable();
    schema.specificType('password', 'char(60)').notNullable();
    schema.string('state', 63).defaultTo('awaiting_confirm');
    schema.enum('type', ['root', 'employee', 'client']).defaultTo('client');
    schema.integer('role_id').unsigned().notNullable();

    schema.foreign('role_id').references('id').inTable('roles');
    schema.timestamps();
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists(table);
}

