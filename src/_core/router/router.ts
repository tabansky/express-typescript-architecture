import { GlobalErrorHandler } from '@core/handlers/error.handler';
import { HttpException } from '@core/handlers/http-exception';
import { Controllers } from '@types';
import { NextFunction, Request, Response } from 'express';
import { ValidationError } from 'joi';
import { logger } from 'src/tools/logger';

import { toRoutesJSON } from './helper';
import { HttpStatusCodes } from '../constants';
import { Application } from '../declarations';
import { HttpValidator, RouteDefinition, RouterComponents } from '../types';

export class Router {
  constructor(private app: Application, private components: RouterComponents[], private globalPrefix = '') {}

  public commit(): RouteDefinition[] {
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

      this.register(routeDefinitions.at(-1)!);
    });

    return routeDefinitions;
  }

  private validateAndPipeRequest(validator: HttpValidator = {}) {
    function catchError(error?: ValidationError) {
      if (!error) {
        return;
      }

      throw new HttpException(HttpStatusCodes.BAD_REQUEST, 'Request validation error', { errors: error.details });
    }

    return function (req: Request, res: Response, next: NextFunction): void {
      if (!Object.keys(validator).length) {
        return;
      }

      const { routeSchema, querySchema, bodySchema } = validator;

      if (routeSchema) {
        const { error, value } = routeSchema.validate(req.params);

        catchError(error);
        req.params = value;
      }

      if (querySchema) {
        const { error, value } = querySchema.validate(req.query);

        catchError(error);
        req.query = value;
      }

      if (bodySchema) {
        const { error, value } = bodySchema.validate(req.body);

        catchError(error);
        req.body = value;
      }
    };
  }

  private isMethodAllowed(methods: string[], method: string): boolean {
    return methods.includes(method);
  };

  private register(route: RouteDefinition): void {
    const controllers = this.app.get('controllers');
    const middlewares = this.app.get('middlewares');

    const [className, method] = route.handler.split('.') as [keyof Controllers, keyof Controllers[keyof Controllers]];

    const controller = controllers[className];
    const handler = controller[method];
    const middleware = route.middleware.map(ml => middlewares[ml]);

    if (typeof handler !== 'function') {
      logger.error(`handler ${className}.${method as string} must be a function`);
      throw new Error('handler must be a function');
    }

    // todo move to method apart
    const handlerWithCatcher = async (req: Request, res: Response, next: NextFunction) => {
      if (!this.isMethodAllowed(route.methods, req.method)) {
        return next();
      }

      try {
        middleware.forEach((ml) => ml(req, res, next));
        this.validateAndPipeRequest(route.validator)(req, res, next);

        await handler.call(controller, req, res);
      } catch (err) { // todo validate how it can be made better
        GlobalErrorHandler(err, req, res, next);
      }
    };

    // todo add tracker for user actions
    this.app.use(route.pattern, handlerWithCatcher);
  }
}
