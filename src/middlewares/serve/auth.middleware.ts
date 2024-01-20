import { Application } from '@core/declarations';
import { MiddlewareHandler } from '@core/types';
import { NextFunction, Request, Response } from 'express';

export const AuthMiddleware = (app: Application): MiddlewareHandler => {
  return function (req: Request, res: Response, next: NextFunction): void {
    if (!req.cookies.user) {
      const { SessionTokens } = app.get('repositories');

      // const token = SessionTokens.getTokenByEntityId();
    }

    return next();
  };
};
