import { Controllers, RouteHandler, RouterComponents } from '@core/types';

import { GroupComponent, ResourceComponent, RouteComponent } from './components';

export class Route<T extends keyof Controllers> {
  private constructor(public routes: RouterComponents<T>[]) {}

  public static build<T extends keyof Controllers>(routes: RouterComponents<T>[]): GroupComponent<T> {
    return new GroupComponent<T>(routes);
  }

  /**
   * @deprecated not supports validation (not recommended)
   */
  public static resource<T extends keyof Controllers>(
    resourcePattern: string,
    controller: keyof Controllers,
  ): ResourceComponent<T> {
    return new ResourceComponent(resourcePattern, controller);
  }

  public static route<T extends keyof Controllers>(
    pattern: string,
    methods: string[],
    handler: RouteHandler<T>,
  ): RouteComponent<T> {
    return new RouteComponent<T>(pattern, methods, handler);
  }

  public static get<T extends keyof Controllers>(pattern: string, handler: RouteHandler<T>): RouteComponent<T> {
    return this.route<T>(pattern, ['GET', 'HEAD'], handler);
  }

  public static post<T extends keyof Controllers>(pattern: string, handler: RouteHandler<T>): RouteComponent<T> {
    return this.route<T>(pattern, ['POST'], handler);
  }

  public static put<T extends keyof Controllers>(pattern: string, handler: RouteHandler<T>): RouteComponent<T> {
    return this.route<T>(pattern, ['PUT'], handler);
  }

  public static patch<T extends keyof Controllers>(pattern: string, handler: RouteHandler<T>): RouteComponent<T> {
    return this.route<T>(pattern, ['PATCH'], handler);
  }

  public static delete<T extends keyof Controllers>(pattern: string, handler: RouteHandler<T>): RouteComponent<T> {
    return this.route<T>(pattern, ['DELETE'], handler);
  }
}
