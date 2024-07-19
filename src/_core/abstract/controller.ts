import { Application, ProvidedTypes } from '@core/declarations';

export abstract class Controller {
  protected services: ProvidedTypes['services'];

  constructor(protected readonly app: Application) {
    this.services = app.get('services');
  }
}
