import { ProvidedTypes } from '@core/declarations';
import { RouteMethod, RouteGroup, RouteResource } from '@core/router';
import { RouteHandler, RouterComponents } from '@core/types';

export class Route {
  public static group(routes: RouterComponents[]): RouteGroup {
    return new RouteGroup(routes);
  }

  public static resource(resourcePattern: string, controller: keyof ProvidedTypes['controllers']): RouteResource {
    return new RouteResource(resourcePattern, controller);
  }

  public static route(pattern: string, methods: string[], handler: RouteHandler): RouteMethod {
    return new RouteMethod(pattern, methods, handler);
  }

  public static get(pattern: string, handler: RouteHandler): RouteMethod {
    return this.route(pattern, ['GET', 'HEAD'], handler);
  }

  public static post(pattern: string, handler: RouteHandler): RouteMethod {
    return this.route(pattern, ['POST'], handler);
  }

  public static put(pattern: string, handler: RouteHandler): RouteMethod {
    return this.route(pattern, ['PUT'], handler);
  }

  public static patch(pattern: string, handler: RouteHandler): RouteMethod {
    return this.route(pattern, ['PATCH'], handler);
  }

  public static delete(pattern: string, handler: RouteHandler): RouteMethod {
    return this.route(pattern, ['DELETE'], handler);
  }
}
