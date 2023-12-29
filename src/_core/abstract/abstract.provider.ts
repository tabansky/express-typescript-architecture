import { Application } from '@core/declarations';

export abstract class Provider {
  public static provide(_app: Application) {
    throw new Error('Not implemented');
  }
}
