import type { Knex } from 'knex';

const table = 'permissions';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable(table, (schema) => {
    schema.boolean('can_access').defaultTo(true);
    schema.string('pattern').notNullable();
    schema.string('handler').notNullable();
    schema.enum('scope', ['all', 'own']).notNullable();
    schema.integer('role_id').unsigned().notNullable();

    schema.primary(['pattern', 'role_id', 'handler']);
    schema.foreign('role_id').references('id').inTable('roles').onDelete('cascade');

    schema.timestamp('created_at').defaultTo(knex.fn.now());
    schema.timestamp('updated_at').defaultTo(knex.raw('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP'));
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists(table);
}

