import { sessionConfig } from '@config';
import { Provider } from '@core/abstract/abstract.provider';
import { Application } from '@core/declarations';
import session from 'express-session';

export class SessionProvider extends Provider {
  public static provide(app: Application): void {
    app.use(session(sessionConfig));
  }
}
