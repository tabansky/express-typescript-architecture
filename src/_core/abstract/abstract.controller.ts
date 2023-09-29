import { Application } from '@core/declarations';

export abstract class Controller {
  constructor(protected readonly app: Application) {}
}
