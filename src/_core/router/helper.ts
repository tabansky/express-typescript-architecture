import { Request, Response } from '@core/declarations';
import { Controllers, HttpValidator, RouterComponents, RouteDefinition, MiddlewareHandler } from '@core/types';
import { NextFunction } from 'express';
import { ValidationError } from 'joi';

import { GroupComponent, ResourceComponent, RouteComponent } from './components';
import { HttpStatusCodes } from '../constants';
import { HttpException } from '../utils/http-exception';

export function normalizeRoute(input: string): string {
  if (input === '/') {
    return input;
  }

  return `/${input.replace(/^\//, '').replace(/\/$/, '')}`;
}

export function toRoutesJSON<T extends keyof Controllers>(routes: RouterComponents<T>[]): RouteComponent<T>[] {
  return routes.reduce((list: RouteComponent<T>[], route) => {
    if (route instanceof GroupComponent) {
      return list.concat(toRoutesJSON(route.routes));
    }

    if (route instanceof ResourceComponent) {
      return list.concat(toRoutesJSON(route.routes));
    }

    list.push(route);

    return list;
  }, []);
}

function catchValidationError(error?: ValidationError) {
  if (!error) {
    return;
  }

  throw new HttpException(HttpStatusCodes.BAD_REQUEST, 'Request validation error', { errors: error.details });
}

export function validateAndPipeRequest(validator: HttpValidator = {}) {
  return function (req: Request, res: Response, next: NextFunction): void {
    if (!Object.keys(validator).length) {
      return next();
    }

    const { routeSchema, querySchema, bodySchema } = validator;

    if (routeSchema) {
      const { error, value } = routeSchema.validate(req.params);

      catchValidationError(error);
      req.params = value;
    }

    if (querySchema) {
      const { error, value } = querySchema.validate(req.query);

      catchValidationError(error);
      req.query = value;
    }

    if (bodySchema) {
      const { error, value } = bodySchema.validate(req.body);

      catchValidationError(error);
      req.body = value;
    }

    return next();
  };
}
