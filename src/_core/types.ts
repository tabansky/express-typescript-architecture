import { NextFunction } from 'express';
import Joi from 'joi';

import { ProvidedTypes, Response, Request } from './declarations';
import { GroupComponent, ResourceComponent, RouteComponent } from './router/components';

export type Controllers = ProvidedTypes['controllers'];

export type MiddlewareNames = keyof ProvidedTypes['middlewares'];

export type RouteHandler<T extends keyof Controllers = keyof Controllers> = `${T}.${keyof Controllers[T] & string}`;

export type HttpValidator = { routeSchema?: Joi.AnySchema, querySchema?: Joi.AnySchema, bodySchema?: Joi.AnySchema };

export type RouterComponents<T extends keyof Controllers = keyof Controllers> =
RouteComponent<T> | GroupComponent<T> | ResourceComponent<T>;

export type ResourceRouteNames = 'index' | 'edit' | 'store' | 'update' | 'destroy';

export type MiddlewareHandler = (req: Request, res: Response, next: NextFunction) => void | Promise<void>;

export type RouteDefinition<T extends keyof Controllers = keyof Controllers> = {
  pattern: string,
  handler: RouteHandler<T> | string,
  methods: string[],
  middleware: MiddlewareNames[],
  validator?: HttpValidator,
};

export type ResourceMiddleware = { [R in ResourceRouteNames]?: MiddlewareNames | MiddlewareNames[] }
& { '*'?: MiddlewareNames | MiddlewareNames[] };

export type ReqGeneric = Partial<Record<'params' | 'query' | 'body', unknown>>;
// export type Request<T extends ReqGeneric = ReqGeneric> = ExpressRequest<T['params'], never, T['body'], T['query']> & {
//   endpoint: { pattern: string, handler: string }
//   user: DecodedToken;
//   scope?: PermissionScopes;
// };
