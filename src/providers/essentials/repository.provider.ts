import { Provider } from '@core/abstract/abstract.provider';
import { Application } from '@core/declarations';
import { Repositories } from '@types';
import { ConfirmationTokens, Permissions, Roles, SessionTokens, Users } from 'src/repositories';

const key = 'repositories';

declare module '@core/declarations' {
  export interface ProvidedTypes {
    [key]: Repositories;
  }
}

export class RepositoryProvider implements Provider {
  public static provide(app: Application): void {
    const knexClient = app.get('knexClient');

    const repositories: Repositories = {
      Roles: new Roles(knexClient),
      Users: new Users(knexClient),
      SessionTokens: new SessionTokens(knexClient),
      ConfirmationTokens: new ConfirmationTokens(knexClient),
      Permissions: new Permissions(knexClient),
    };

    app.set(key, repositories);
  }
}
