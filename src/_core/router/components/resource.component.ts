import { Controllers, MiddlewareNames, ResourceMiddleware, ResourceRouteNames, RouteHandler } from '@core/types';

import { RouteComponent } from './route.component';

export class ResourceComponent<T extends keyof Controllers> {
  public routes: RouteComponent<T>[] = [];

  constructor(private resource: string, private controller: keyof Controllers) {
    this.buildRoutes();
  }

  public only(names: ResourceRouteNames[]): this {
    this.routes = this.filter(names, true);
    return this;
  }

  public except(names: ResourceRouteNames[]): this {
    this.routes = this.filter(names, false);
    return this;
  }

  public middleware(middleware: ResourceMiddleware, prepend = true): this {
    for (const name in middleware) {
      if (name === '*') {
        this.routes.forEach((route) => route.middleware(middleware[name as MiddlewareNames], prepend));
        continue;
      }

      const findRoute = this.routes.find((route) => route.getHandler().endsWith(name));

      if (findRoute) {
        findRoute.middleware(middleware[name], prepend);
      }
    }

    return this;
  }

  private makeRoute(pattern: string, methods: string[], action: ResourceRouteNames): void {
    const route = new RouteComponent(pattern, methods, `${this.controller}.${action}` as RouteHandler<T>);

    this.routes.push(route);
  }

  private buildRoutes(): void {
    this.resource = this.resource.replace(/^\//, '').replace(/\/$/, '');

    this.makeRoute(this.resource, ['GET', 'HEAD'], 'index');
    this.makeRoute(this.resource, ['POST'], 'store');
    this.makeRoute(`${this.resource}/:id`, ['GET', 'HEAD'], 'edit');
    this.makeRoute(`${this.resource}/:id`, ['PUT', 'PATCH'], 'update');
    this.makeRoute(`${this.resource}/:id`, ['DELETE'], 'destroy');
  }

  private filter(names: ResourceRouteNames[], inverse: boolean): RouteComponent<T>[] {
    return this.routes.filter((route) => {
      const match = names.find((name) => route.getHandler().endsWith(name));
      return inverse ? !match : match;
    });
  }
}
