import { Provider } from '@core/abstract/abstract.provider';
import { Application } from '@core/declarations';
import { Services } from '@types';
import { AuthService } from 'src/services';

const key = 'services';

declare module '@core/declarations' {
  export interface ProvidedTypes {
    [key]: Services;
  }
}

export class ServiceProvider extends Provider {
  public static provide(app: Application): void {
    const services: Services = {
      Auth: new AuthService(app),
    };

    app.set(key, services);
  }
}
