import { Provider } from '@core/abstract/abstract.provider';
import { Application } from '@core/declarations';
import { Router } from '@core/router';
import { RouteDefinition } from '@core/types';
import { apiRoutes } from 'routes';

const key = 'routes';

declare module '@core/declarations' {
  export interface ProvidedTypes {
    [key]: RouteDefinition[];
  }
}

export class RouteProvider extends Provider {
  public static provide(app: Application): void {
    const routes = [
      ...new Router(app, apiRoutes, 'api').commit(),
    ];

    app.set(key, routes);
  }
}
