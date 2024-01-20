import { Provider } from '@core/abstract/abstract.provider';

import { ControllerProvider } from './essentials/controller.provider';
import { DatabaseProvider } from './essentials/database.provider';
import { MiddlewareProvider } from './essentials/middleware.provider';
import { RepositoryProvider } from './essentials/repository.provider';
import { RouteProvider } from './essentials/route.provider';
import { ServiceProvider } from './essentials/service.provider';
import { SessionProvider } from './essentials/session.provider';
import { SwaggerProvider } from './essentials/swagger.provider';

// note: keep order of dependencies
export const providers: typeof Provider[] = [
  SessionProvider,
  DatabaseProvider,
  RepositoryProvider,
  ServiceProvider,
  ControllerProvider,
  RouteProvider,
  SwaggerProvider,
  MiddlewareProvider,
];
