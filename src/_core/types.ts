import { RouteGroup, RouteMethod, RouteResource } from '@core/router';
import { NextFunction, Request as ExpressRequest, Response } from 'express';
import Joi from 'joi';

import { ProvidedTypes } from './declarations';

export type MiddlewareNames = keyof ProvidedTypes['middlewares'];
export type RouteHandler = `${keyof ProvidedTypes['controllers']}.${keyof ProvidedTypes['controllers'][keyof ProvidedTypes['controllers']]}`;

export type HttpValidator = { routeSchema?: Joi.AnySchema, querySchema?: Joi.AnySchema, bodySchema?: Joi.AnySchema };

export type RouterComponents = RouteMethod | RouteGroup | RouteResource;

export type ResourceRouteNames = 'index' | 'edit' | 'store' | 'update' | 'destroy';

export type MiddlewareHandler = (req: ExpressRequest, res: Response, next: NextFunction) => void;

export type RouteDefinition = {
  pattern: string,
  handler: RouteHandler,
  methods: string[],
  middleware: MiddlewareNames[],
  validator?: HttpValidator,
};

type ReqGeneric = Partial<Record<'params' | 'query' | 'body', unknown>>;
export type Request<T extends ReqGeneric = ReqGeneric> = ExpressRequest<T['params'], never, T['body'], T['query']>;
