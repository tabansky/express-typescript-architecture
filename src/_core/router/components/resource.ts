import { Route } from './route';
import { MiddlewareHandler, ResourceRouteNames } from '../../types';

type ResourceMiddleware = { [R in ResourceRouteNames]?: MiddlewareHandler | MiddlewareHandler[] }
& { '*'?: MiddlewareHandler | MiddlewareHandler[] };

export class RouteResource {
  private resourceParamNames: Record<string, string> = {};

  public routes: Route[] = [];

  constructor(private resource: string, private controller: string) {
    this.buildRoutes();
  }

  private makeRoute(pattern: string, methods: string[], action: ResourceRouteNames) {
    const route = new Route(pattern, methods, `${this.controller}.${action}`);

    this.routes.push(route);
  }

  private buildRoutes() {
    this.resource = this.resource.replace(/^\//, '').replace(/\/$/, '');

    this.makeRoute(this.resource, ['GET', 'HEAD'], 'index');
    this.makeRoute(this.resource, ['POST'], 'store');
    this.makeRoute(`${this.resource}/:id`, ['GET', 'HEAD'], 'edit');
    this.makeRoute(`${this.resource}/:id`, ['PUT', 'PATCH'], 'update');
    this.makeRoute(`${this.resource}/:id`, ['DELETE'], 'destroy');
  }

  private filter(names: ResourceRouteNames[], inverse: boolean) {
    return this.routes.filter((route) => {
      const match = names.find((name) => route.getHandler().endsWith(name));
      return inverse ? !match : match;
    });
  }

  public only(names: ResourceRouteNames[]): this {
    this.routes = this.filter(names, true);
    return this;
  }

  public except(names: ResourceRouteNames[]): this {
    this.routes = this.filter(names, false);
    return this;
  }

  public middleware(middleware: ResourceMiddleware): this {
    for (const name in middleware) {
      if (name === '*') {
        this.routes.forEach((route) => route.middleware(middleware[name]));
        continue;
      }

      const findRoute = this.routes.find((route) => route.getHandler().endsWith(name));

      if (findRoute) {
        findRoute.middleware(middleware[name]);
      }
    }

    return this;
  }
}
