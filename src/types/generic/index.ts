import { MiddlewareHandler } from '@core/types';
import { AuthController } from 'controllers/auth.controller';
import { ConfirmationTokens, Permissions, Roles, SessionTokens, Users } from 'repositories';
import { AuthService } from 'services';

export interface Repositories {
  Roles: Roles;
  Users: Users;
  SessionTokens: SessionTokens;
  ConfirmationTokens: ConfirmationTokens;
  Permissions: Permissions;
}

export interface Services {
  Auth: AuthService;
}

export interface Controllers {
  AuthController: AuthController;
};

export interface Middlewares {
  Auth: MiddlewareHandler;
}

