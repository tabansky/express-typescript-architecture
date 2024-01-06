import { Provider } from '@core/abstract/abstract.provider';
import { ControllerProvider } from 'providers/essentials/controller.provider';
import { DatabaseProvider } from 'providers/essentials/database.provider';
import { MiddlewareProvider } from 'providers/essentials/middleware.provider';
import { RepositoryProvider } from 'providers/essentials/repository.provider';
import { RouteProvider } from 'providers/essentials/route.provider';
import { ServiceProvider } from 'providers/essentials/service.provider';
import { SessionProvider } from 'providers/essentials/session.provider';
import { SwaggerProvider } from 'providers/essentials/swagger.provider';

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
