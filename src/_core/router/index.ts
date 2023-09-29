import { Application } from '@core/declarations';
import { RouterComponent } from '@types';

import { RouteGroup } from './components/group';
import { RouteResource } from './components/resource';
import { Route } from './components/route';
import { logger } from '../../utils/logger';
import { toRoutesJSON } from '../helpers/router-helper';
import { RouteDefinition, RouteHandler } from '../types';

export class Router {
  constructor(private app: Application, private components: RouterComponent[], private globalPrefix = '') {}

  public group(routes: Route[]): RouteGroup {
    return new RouteGroup(routes);
  }

  public resource(resourcePattern: string, controller: string): RouteResource {
    return new RouteResource(resourcePattern, controller);
  }

  public static route(pattern: string, methods: string[], handler: RouteHandler): Route {
    return new Route(pattern, methods, handler);
  }

  public static get(pattern: string, handler: RouteHandler): Route {
    return this.route(pattern, ['GET', 'HEAD'], handler);
  }

  public static post(pattern: string, handler: RouteHandler): Route {
    return this.route(pattern, ['POST'], handler);
  }

  public static put(pattern: string, handler: RouteHandler): Route {
    return this.route(pattern, ['PUT'], handler);
  }

  public static patch(pattern: string, handler: RouteHandler): Route {
    return this.route(pattern, ['PATCH'], handler);
  }

  public static delete(pattern: string, handler: RouteHandler): Route {
    return this.route(pattern, ['DELETE'], handler);
  }

  public commit(): void {
    const handlers: string[] = [];
    const routeDefinitions: RouteDefinition[] = [];

    const routes = toRoutesJSON(this.components);

    routes.forEach(route => {
      const handler = route.getHandler();

      if (this.globalPrefix) {
        route.prefix(this.globalPrefix);
      }

      if (handlers.indexOf(handler) !== -1) {
        throw Error('Duplicate route handler');
      }

      handlers.push(handler);
      routeDefinitions.push(route.toJSON());

      this.register(routeDefinitions.at(-1));
    });

    this.store(routeDefinitions);
  }

  private register(route: RouteDefinition): void {
    const controllers = this.app.get('controllers');
    const middlewares = this.app.get('middlewares');

    const [className, method] = route.handler.split('.');

    const handler = controllers[className]?.[method];
    const middleware = route.middleware.map(ml => middlewares[ml]);

    if (typeof handler !== 'function') {
      logger.error(`handler ${className}.${method} must be a function`);
      throw new Error('handler must be a function');
    }

    if (middleware.includes(undefined)) {
      logger.error('middleware function is not registered');
      throw new Error('middleware is not registered function');
    }

    this.app.use(route.pattern, middleware, handler);
  }

  private store(routes: RouteDefinition[]): void {
    this.app.set('routes', routes);
  }
}
