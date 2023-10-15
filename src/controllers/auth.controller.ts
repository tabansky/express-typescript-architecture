import { Controller } from '@core/abstract/abstract.controller';
import { Application } from '@core/declarations';
import { compare } from 'bcrypt';
import { Request, Response } from 'express';

import { HttpStatusCodes } from '../_core/constants';
import { HttpException } from '../_core/exceptions/http-exception';
import { generateBearerToken, getTokenValidityHours } from '../helpers/auth.helper';
import { getHoursInMs } from '../helpers/time.helper';

export class AuthController extends Controller {
  constructor(app: Application) {
    super(app);
  }

  public async login(req: Request, res: Response): Promise<void> {
    const { SessionTokens, Users } = this.app.get('repositories');
    const { email, password, remember = false } = req.body;

    const user = await Users.getByEmail(email);
    const isSamePassword = await compare(password, user?.password);

    if (!isSamePassword) {
      throw new HttpException(HttpStatusCodes.UNAUTHORIZED, 'Incorrect user or password');
    }

    const token = generateBearerToken();
    const expires = new Date(new Date().getTime() + getTokenValidityHours(remember));

    await SessionTokens.create(user.id, token, expires);

    res.cookie('token', token, { maxAge: getHoursInMs(2) });
    res.sendStatus(HttpStatusCodes.CREATED);
  }

  public async logout(req: Request, res: Response): Promise<void> {
    const { SessionTokens } = this.app.get('repositories');

    await SessionTokens.delete(req.cookies.user);

    res.clearCookie('user');
    res.sendStatus(HttpStatusCodes.NO_CONTENT);
  }
}
