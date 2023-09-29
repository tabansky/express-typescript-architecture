import { Application } from '@core/declarations';
import { Middlewares } from '@types';

const key = 'middlewares';

declare module '@core/declarations' {
  interface UtilsServiceTypes {
    [key]: Middlewares;
  }
}

export const setupMiddlewares = (app: Application): void => {
  const middlewares: Middlewares = {
  };

  app.set(key, middlewares);
};
