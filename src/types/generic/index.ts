import { MiddlewareHandler } from '@core/types';
import { AuthController } from 'src/controllers/auth.controller';
import { ConfirmationTokens, Permissions, Roles, SessionTokens, Users } from 'src/repositories';
import { AuthService } from 'src/services';

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

