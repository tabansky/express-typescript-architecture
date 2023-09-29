import { ExampleController } from '@controllers';
import { RouteGroup } from '@core/router/components/group';
import { RouteResource } from '@core/router/components/resource';
import { Route } from '@core/router/components/route';
import { ExampleRepository } from '@repositories';

export interface Repositories {
  Example: ExampleRepository;
}

export interface Controllers {
  Example: ExampleController
}

export interface Middlewares {
  [x: string] : (req, res, next) => void;
}

export type RouterComponent = Route | RouteGroup | RouteResource;
