import { RouteResource } from './resource';
import { Route } from './route';
import { MiddlewareHandler } from '../../types';

export class RouteGroup {
  private groupMiddleware: MiddlewareHandler[] = [];

  constructor(public routes: (Route | RouteResource | RouteGroup)[]) {}

  private invoke(route: Route | RouteResource | RouteGroup, method: string, params: any[]) {
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

  public middleware(middleware: MiddlewareHandler | MiddlewareHandler[], prepend: boolean = false): this {
    middleware = Array.isArray(middleware) ? middleware : [middleware];

    if (prepend) {
      middleware.forEach((mw) => this.groupMiddleware.unshift(mw));
    } else {
      middleware.forEach((mw) => this.groupMiddleware.push(mw));
    }

    this.routes.forEach((route) => this.invoke(route, 'middleware', [this.groupMiddleware, true]));

    return this;
  }
}
