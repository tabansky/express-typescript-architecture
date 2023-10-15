import { ExampleController } from '@controllers';
import { RouteGroup } from '@core/router/components/group';
import { RouteResource } from '@core/router/components/resource';
import { Route } from '@core/router/components/route';
import { Roles, SessionTokens, Users } from '@repositories';

export interface Repositories {
  Roles: Roles,
  Users: Users,
  SessionTokens: SessionTokens,
}

export interface Controllers {
  Example: ExampleController
}

export interface Middlewares {
  [x: string] : (req, res, next) => void;
}

export type RouterComponent = Route | RouteGroup | RouteResource;
