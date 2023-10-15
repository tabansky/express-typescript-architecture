import { Application } from '@core/declarations';
import { Roles, Users, SessionTokens } from '@repositories';
import { Repositories } from '@types';

const key = 'repositories';

declare module '@core/declarations' {
  interface UtilsServiceTypes {
    [key]: Repositories;
  }
}

export const setupRepositories = (app: Application): void => {
  const knexClient = app.get('knexClient');

  const repositories: Repositories = {
    Roles: new Roles(knexClient),
    Users: new Users(knexClient),
    SessionTokens: new SessionTokens(knexClient),
  };

  app.set(key, repositories);
};
