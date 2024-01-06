import { Application } from '@core/declarations';

export abstract class Service {
  constructor(protected app: Application) {}
}
