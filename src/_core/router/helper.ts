import { RouteGroup, RouteMethod, RouteResource } from '@core/router';
import { RouterComponents } from '@core/types';

export function dropSlash(input: string): string {
  if (input === '/') {
    return input;
  }

  return `/${input.replace(/^\//, '').replace(/\/$/, '')}`;
}

export function toRoutesJSON(routes: RouterComponents[]): RouteMethod[] {
  return routes.reduce((list: RouteMethod[], route) => {
    if (route instanceof RouteGroup) {
      list = list.concat(toRoutesJSON(route.routes));
      return list;
    }

    if (route instanceof RouteResource) {
      list = list.concat(toRoutesJSON(route.routes));
      return list;
    }

    list.push(route);

    return list;
  }, []);
}
