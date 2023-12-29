import { Provider } from '@core/abstract/abstract.provider';
import { Application } from '@core/declarations';
import { MiddlewareHandler } from '@core/types';
import { Middlewares } from '@types';
import { NotFoundMiddleware } from 'middlewares/global/not-found.middleware';
import { AuthMiddleware } from 'middlewares/serve/auth.middleware';

const key = 'middlewares';

declare module '@core/declarations' {
  interface ProvidedTypes {
    [key]: Middlewares;
  }
}

export class MiddlewareProvider extends Provider {
  public static provide(app: Application): void {
    this.provideGlobalMiddlewares(app);

    const middlewares: Middlewares = {
      Auth: AuthMiddleware,
    };

    app.set(key, middlewares);
  }

  private static provideGlobalMiddlewares(app: Application): void {
    const globalMiddlewares: MiddlewareHandler[] = [
      NotFoundMiddleware,
    ];

    globalMiddlewares.forEach(middleware => app.use(middleware));
  }
}
