import { Controller } from '@core/abstract/abstract.controller';
import { HttpStatusCodes } from '@core/constants';
import { Application } from '@core/declarations';
import { Request, Response } from 'express';

import { getHoursInMs } from '../helpers/time.helper';

export class AuthController extends Controller {
  constructor(app: Application) {
    super(app);
  }

  /**
   * @abstract Creates session token using user credentials.
   * The session token stores in DB and temporarily in cookies.
   * When the session token is expired in cookies it will be searched in database,
   * in case of the session token is expired in database too - throw exception.
   */

  /**
   * @description
   */
  public async register(req: Request, res: Response): Promise<void> {
    // const token = await this.services.Auth.register(req.body);

    // res.cookie('token', token, { maxAge: getHoursInMs(2) });
    res.sendStatus(HttpStatusCodes.CREATED);
  }

  /**
   * @description Creates session token using user credentials.
   * The session token stores in DB and temporarily in cookies.
   * @returns cookies with status created (201)
   */
  public async login(req: Request, res: Response): Promise<void> {
    const token = await this.services.Auth.login(req.body);

    res.cookie('token', token, { maxAge: getHoursInMs(2) });
    res.sendStatus(HttpStatusCodes.CREATED);
  }

  /**
   * @description Logging out from current session on current device
   */
  public async logout(req: Request, res: Response): Promise<void> {
    const { SessionTokens } = this.app.get('repositories');

    await SessionTokens.delete(req.cookies.user);

    res.clearCookie('user');
    res.sendStatus(HttpStatusCodes.NO_CONTENT);
  }

  /**
   * @description Logging out from sessions on all devices
   */
  public async logoutAll(req: Request, res: Response): Promise<void> {
    throw new Error('not implemented');
  }
}
