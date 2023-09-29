import { Application as ExpressApplication } from 'express';
import { Knex } from 'knex';

interface UtilsServiceTypes {
  knexClient: Knex,
}

interface Application extends ExpressApplication {
  get<N extends keyof UtilsServiceTypes>(name: N): UtilsServiceTypes[N];
}
