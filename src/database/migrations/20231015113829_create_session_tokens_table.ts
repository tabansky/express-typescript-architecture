import { Knex } from 'knex';

const table = 'session_tokens';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable(table, (schema) => {
    schema.increments('id');

    schema.string('token', 340).notNullable();
    schema.string('user_agent').notNullable();
    schema.string('entity').notNullable();
    schema.string('entity_id').notNullable();
    schema.dateTime('expires_at').notNullable();

    schema.unique(['entity', 'entity_id', 'token', 'user_agent']);

    schema.timestamp('created_at').defaultTo(knex.fn.now());
    schema.timestamp('updated_at').defaultTo(knex.raw('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP'));
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists(table);
}

