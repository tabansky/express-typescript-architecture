import { Controllers, MiddlewareNames, RouterComponents } from '@core/types';

import { ResourceComponent } from './resource.component';

export class GroupComponent<T extends keyof Controllers> {
  constructor(public routes: RouterComponents<T>[]) {}

  public prefix(prefix: string): this {
    this.routes.forEach((route) => this.invoke(route, 'prefix', [prefix]));
    return this;
  }

  public middleware(middleware: MiddlewareNames | MiddlewareNames[], prepend: boolean = true): this {
    middleware = Array.isArray(middleware) ? middleware : [middleware];

    this.routes.forEach((route) => this.invoke(route, 'middleware', [middleware, prepend]));

    return this;
  }

  private invoke(route: RouterComponents<T>, method: string, params: unknown[]): void {
    if (route instanceof ResourceComponent) {
      return route.routes.forEach((child) => this.invoke(child, method, params));
    }

    if (route instanceof GroupComponent) {
      return route.routes.forEach((child) => this.invoke(child, method, params));
    }

    route[method](...params);
  }
}
