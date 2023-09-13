import { Repositories } from '@types';
import { Knex } from 'knex';

import { Application } from '../../declarations';
import { ExampleRepository } from '../example.repository';

const key = 'repositories';

declare module '../../declarations' {
  interface UtilsServiceTypes {
    [key]: Repositories;
  }
}

export const initializeRepositories = (app: Application): void => {
  const knexClient = app.get('knexClient');

  const repositories: Repositories = {
    Example: new ExampleRepository(knexClient),
  };

  app.set('repositories', repositories);
};
