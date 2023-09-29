import { dropSlash } from '../../helpers/router-helper';
import { MiddlewareHandler, RouteDefinition, RouteHandler } from '../../types';

export class Route {
  private prefixes: string[] = [];

  private routeMiddleware: MiddlewareHandler[][] = [];

  constructor(private pattern: string, private methods: string[], private handler: RouteHandler) {}

  public prefix(prefix: string): this {
    this.prefixes.push(prefix);
    return this;
  }

  public getHandler(): RouteHandler {
    return this.handler;
  }

  public middleware(middleware: MiddlewareHandler | MiddlewareHandler[], prepend = false): this {
    middleware = Array.isArray(middleware) ? middleware : [middleware];

    if (prepend) {
      this.routeMiddleware.unshift(middleware);
    } else {
      this.routeMiddleware.push(middleware);
    }

    return this;
  }

  public toJSON(): RouteDefinition {
    return {
      pattern: this.computePattern(),
      handler: this.handler,
      methods: this.methods,
      middleware: this.routeMiddleware.flat(),
    };
  }

  private computePattern(): string {
    const pattern = dropSlash(this.pattern);
    const prefix = this.prefixes
      .slice()
      .reverse()
      .map((one) => dropSlash(one))
      .join('');
    return prefix ? `${prefix}${pattern === '/' ? '' : pattern}` : pattern;
  }
}
