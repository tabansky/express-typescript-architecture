import { MiddlewareHandler } from '@core/types';
import { AuthController } from 'controllers/auth.controller';
import { Roles, SessionTokens, Users } from 'repositories';
import { AuthService } from 'services';

export interface Repositories {
  Roles: Roles,
  Users: Users,
  SessionTokens: SessionTokens,
}

export interface Services {
  Auth: AuthService,
}

export interface Controllers {
  AuthController: AuthController
};

export interface Middlewares {
  Auth: MiddlewareHandler;
}

