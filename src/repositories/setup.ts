import { Application } from '@core/declarations';
import { Repositories } from '@types';

import { ExampleRepository } from './example.repository';

const key = 'repositories';

declare module '@core/declarations' {
  interface UtilsServiceTypes {
    [key]: Repositories;
  }
}

export const setupRepositories = (app: Application): void => {
  const knexClient = app.get('knexClient');

  const repositories: Repositories = {
    Example: new ExampleRepository(knexClient),
  };

  app.set(key, repositories);
};
