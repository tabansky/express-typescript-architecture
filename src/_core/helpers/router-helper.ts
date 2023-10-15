import { RouterComponent } from '@types';

import { RouteGroup } from '../router/components/group';
import { RouteResource } from '../router/components/resource';
import { Route } from '../router/components/route';

export function dropSlash(input: string): string {
  if (input === '/') {
    return input;
  }

  return `/${input.replace(/^\//, '').replace(/\/$/, '')}`;
}

export function toRoutesJSON(routes: RouterComponent[]): Route[] {
  return routes.reduce((list: Route[], route) => {
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
