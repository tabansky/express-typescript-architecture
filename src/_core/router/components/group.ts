import { RouteResource } from '@core/router';
import { MiddlewareNames, RouterComponents } from '@core/types';

export class RouteGroup {
  constructor(public routes: RouterComponents[]) {}

  private invoke(route: RouterComponents, method: string, params: unknown[]): void {
    if (route instanceof RouteResource) {
      route.routes.forEach((child) => this.invoke(child, method, params));
      return;
    }

    if (route instanceof RouteGroup) {
      route.routes.forEach((child) => this.invoke(child, method, params));
      return;
    }

    route[method](...params);
  }

  public prefix(prefix: string): this {
    this.routes.forEach((route) => this.invoke(route, 'prefix', [prefix]));
    return this;
  }

  public middleware(middleware: MiddlewareNames | MiddlewareNames[], prepend: boolean = true): this {
    middleware = Array.isArray(middleware) ? middleware : [middleware];

    this.routes.forEach((route) => this.invoke(route, 'middleware', [middleware, prepend]));

    return this;
  }
}
