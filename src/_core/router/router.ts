import { HttpException } from '@core/handlers/http-exception';
import { NextFunction, Request, Response } from 'express';
import { ValidationError } from 'joi';
import { logger } from 'utils/logger';

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

      this.register(routeDefinitions.at(-1));
    });

    return routeDefinitions;
  }

  private validateAndPipeRequest(validator: HttpValidator = {}) {
    function catchError(error: ValidationError) {
      if (!error) {
        return;
      }

      logger.warn('Request validation error');

      throw new HttpException(HttpStatusCodes.BAD_REQUEST, 'Request validation error', { errors: error.details });
    }

    return function (req: Request, res: Response, next: NextFunction): void {
      if (!Object.keys(validator).length) {
        return next();
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

      return next();
    };
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

    this.app.use(route.pattern, this.validateAndPipeRequest(route.validator), middleware, handler);
  }
}
