import type { Knex } from 'knex';

const table = 'confirmation_tokens';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable(table, (schema) => {
    schema.string('token', 64).notNullable();
    schema.string('action', 64).notNullable();
    schema.dateTime('expires_at').notNullable();
    schema.integer('user_id').unsigned().notNullable();

    schema.primary(['user_id', 'token', 'action']);
    schema.foreign('user_id').references('id').inTable('users');

    schema.timestamp('created_at').defaultTo(knex.fn.now());
    schema.timestamp('updated_at').defaultTo(knex.raw('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP'));
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists(table);
}
