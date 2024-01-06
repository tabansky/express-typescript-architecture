import type { Knex } from 'knex';

const table = 'confirmation_tokens';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTableIfNotExists(table, (schema) => {
    schema.string('token').notNullable();
    schema.string('action', 64).notNullable();
    schema.boolean('is_active').defaultTo(true).notNullable();
    schema.dateTime('expires_at').notNullable();
    schema.integer('user_id').unsigned().notNullable();

    schema.primary(['user_id', 'token']);
    schema.foreign('user_id').references('id').inTable('users');

    schema.timestamps();
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists(table);
}
