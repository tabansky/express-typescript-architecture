import { Application } from '@core/declarations';
import { Controllers } from '@types';

import { ExampleController } from './example.controller';

const key = 'controllers';

declare module '@core/declarations' {
  interface UtilsServiceTypes {
    [key]: Controllers;
  }
}

export const setupControllers = (app: Application): void => {
  const controllers: Controllers = {
    Example: new ExampleController(app),
  };

  app.set(key, controllers);
};
