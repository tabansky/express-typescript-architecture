import type { Knex } from 'knex';

import { databaseConfig } from './src/config';

const config: { [key: string]: Knex.Config } = {
  development: {
    ...databaseConfig,
    migrations: {
      directory: 'src/database/migrations',
      tableName: 'migrations',
      // stub: 'src/database/stubs',
    },
    seeds: {
      directory: 'src/database/seeds',
      // stub: 'src/database/stubs',
    },
  },
};

module.exports = config;
