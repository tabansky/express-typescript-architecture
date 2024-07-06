import { Controllers, MiddlewareHandler, Request, RouteDefinition, RouterComponents } from '@core/types';
import { NextFunction, Response } from 'express';

import { RouteComponent } from './components/route.component';
import { checkAvailableMethodMiddleware, toRoutesJSON, validateAndPipeRequest } from './helper';
import { Application } from '../declarations';

export class Router<T extends keyof Controllers> {
  constructor(private app: Application, private components: RouterComponents<T>[], private globalPrefix = '') {}

  public commit(): RouteDefinition<T>[] {
    return this.prepareRoutes(toRoutesJSON(this.components));
  }

  private prepareRoutes(routes: RouteComponent<T>[]): RouteDefinition<T>[] {
    const handlers: string[] = [];
    const routeDefinitions: RouteDefinition<T>[] = [];

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

      this.register(routeDefinitions.at(-1)!);
    });

    return routeDefinitions;
  }

  private register(route: RouteDefinition<T>): void {
    const controllers = this.app.get('controllers');

    const [className, method] = route.handler.split('.') as [keyof Controllers, keyof Controllers[keyof Controllers]];

    const controller = controllers[className];
    const handler = controller[method] as Function;

    if (typeof handler !== 'function') {
      throw new Error('handler ${className}.${method as string} must be a function');
    }

    const handlerMiddleware = async (req: Request, res: Response, next: NextFunction) => {
      return await handler.call(controller, req, res);
    };

    this.app.use(route.pattern, ...this.generateHandlerMiddlewares(route, handlerMiddleware));
  }

  private generateHandlerMiddlewares(route: RouteDefinition<T>, handler: MiddlewareHandler): MiddlewareHandler[] {
    const middlewares = this.app.get('middlewares');
    const response: MiddlewareHandler[] = [];

    response.push(checkAvailableMethodMiddleware(route));
    response.push(...route.middleware.map(ml => this.middlewareWrapper(middlewares[ml])));
    response.push(this.middlewareWrapper(validateAndPipeRequest(route.validator)));
    response.push(this.middlewareWrapper(handler));

    return response;
  }

  private middlewareWrapper(middleware: MiddlewareHandler): MiddlewareHandler {
    return async (req: Request, res: Response, next: NextFunction) => {
      try {
        await middleware(req, res, next);
      } catch (error) {
        next(error);
      }
    };
  }
}
