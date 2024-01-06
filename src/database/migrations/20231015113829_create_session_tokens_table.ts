import { Knex } from 'knex';

const table = 'session_tokens';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTableIfNotExists(table, (schema) => {
    schema.increments('id');

    schema.string('token', 340).notNullable();
    schema.string('entity').notNullable();
    schema.string('entity_id').notNullable();
    schema.dateTime('expires_at').notNullable();

    schema.timestamps();
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists(table);
}

