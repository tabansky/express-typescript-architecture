import { Controllers, HttpValidator, MiddlewareNames, RouteDefinition, RouteHandler } from '@core/types';
import { AnySchema } from 'joi';

import { normalizeRoute } from '../helper';

export class RouteComponent<T extends keyof Controllers> {
  private prefixes: string[] = [];

  private routeMiddleware: MiddlewareNames[] = [];

  private validations: HttpValidator = {};

  constructor(private pattern: string, private methods: string[], private handler: RouteHandler<T>) {}

  public prefix(prefix: string): this {
    this.prefixes.push(prefix);
    return this;
  }

  public validator(type: keyof HttpValidator, validator: AnySchema): this {
    this.validations[type] = validator;
    return this;
  }

  public getHandler(): RouteHandler<T> {
    return this.handler;
  }

  public middleware(middleware: MiddlewareNames | MiddlewareNames[], prepend = false): this {
    middleware = Array.isArray(middleware) ? middleware : [middleware];

    if (prepend) {
      this.routeMiddleware.unshift(...middleware);
    } else {
      this.routeMiddleware.push(...middleware);
    }

    return this;
  }

  public toJSON(): RouteDefinition<T> {
    return {
      pattern: this.computePattern(),
      handler: this.handler,
      methods: this.methods,
      middleware: this.routeMiddleware,
      validator: this.validations,
    };
  }

  private computePattern(): string {
    const pattern = normalizeRoute(this.pattern);
    const prefix = this.prefixes
      .slice()
      .reverse()
      .map((one) => normalizeRoute(one))
      .join('');

    return prefix ? `${prefix}${pattern === '/' ? '' : pattern}` : pattern;
  }
}
