import { databaseConfig } from '@config';
import { Provider } from '@core/abstract/abstract.provider';
import { Application } from '@core/declarations';
import knex, { Knex } from 'knex';

const key = 'knexClient';

declare module '@core/declarations' {
  export interface ProvidedTypes {
    [key]: Knex;
  }
}

export class DatabaseProvider extends Provider {
  public static provide(app: Application): void {
    app.set(key, knex(databaseConfig));
  }
}
