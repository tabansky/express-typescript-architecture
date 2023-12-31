import { Knex } from 'knex';

export const databaseConfig: Knex.Config = {
  client: 'mysql',
  connection: {
    charset: 'utf8',
    timezone: 'UTC',
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    database: process.env.DB_DATABASE,
  },
  pool: {
    min: 2,
    max: 10,
  },
};
