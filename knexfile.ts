import type { Knex } from 'knex';

import { databaseConfig } from './src/config';

type Config = Record<'development' | 'staging' | 'production', Knex.Config>;

const config: Partial<Config> = {
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
