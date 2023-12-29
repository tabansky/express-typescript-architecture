import { Provider } from '@core/abstract/abstract.provider';
import { Application } from '@core/declarations';
import { Controllers } from '@types';
import { AuthController } from 'controllers/auth.controller';

const key = 'controllers';

declare module '@core/declarations' {
  export interface ProvidedTypes {
    [key]: Controllers;
  }
}

export class ControllerProvider extends Provider {
  public static provide(app: Application): void {
    const controllers: Controllers = {
      AuthController: new AuthController(app),
    };

    app.set(key, controllers);
  }
}

