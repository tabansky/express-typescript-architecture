import { Controller } from '@core/abstract/abstract.controller';
import { HttpStatusCodes } from '@core/constants';
import { Application } from '@core/declarations';
import { Request } from '@core/types';
import { AuthForgotBodyParams, ConfirmationQueryParams, LoginBodyParams, RegisterBodyParams } from '@types';
import { Response } from 'express';

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
   * @description Checks action confirmation token and returns boolean value.
   */
  public async validateConfirmationToken(
    req: Request<{ query: ConfirmationQueryParams }>,
    res: Response
  ): Promise<Response<{ valid: boolean }>> {
    const { email, token } = req.query;

    const valid = await this.services.Auth.validateConfirmationToken(email, token);

    return res.status(HttpStatusCodes.OK).json({ valid });
  }

  /**
   * @description Creates new user and sends email with account confirmation.
   */
  public async register(req: Request<{ body: RegisterBodyParams }>, res: Response): Promise<Response<void>> {
    const { email, password } = req.body;

    await this.services.Auth.register(email, password);

    return res.sendStatus(HttpStatusCodes.CREATED);
  }

  /**
   * @description Requests to restore access to a user account.
   */
  public async forgot(req: Request<{ body: AuthForgotBodyParams }>, res: Response): Promise<Response<void>> {
    const { type, value } = req.body;

    // await this.services.Auth.forgot(type, value);

    return res.sendStatus(HttpStatusCodes.NO_CONTENT);
  }

  /**
   * @description Validates action token and confirm selected action.
   */
  public async confirm(req: Request<{ body: ConfirmationQueryParams }>, res: Response): Promise<Response<void>> {
    const { email, token } = req.body;

    await this.services.Auth.confirmEmail(email, token);

    return res.sendStatus(HttpStatusCodes.NO_CONTENT);
  }

  /**
   * @description Creates session token using user credentials.
   * The session token stores in DB and temporarily in cookies.
   * @returns cookies with status created (201)
   */
  public async login(req: Request<{ body: LoginBodyParams }>, res: Response): Promise<Response<void>> {
    const { email, password, remember } = req.body;

    const token = await this.services.Auth.login(email, password, remember);
    res.cookie('token', token, { maxAge: getHoursInMs(2) });

    return res.sendStatus(HttpStatusCodes.CREATED);
  }

  /**
   * @description Logging out from current session.
   */
  public async logout(req: Request, res: Response): Promise<Response<void>> {
    const { SessionTokens } = this.app.get('repositories');

    await SessionTokens.delete(req.cookies.user);
    res.clearCookie('user');

    return res.sendStatus(HttpStatusCodes.NO_CONTENT);
  }

  /**
   * @description Logging out from sessions on all devices.
   */
  public async logoutAll(req: Request, res: Response): Promise<Response<void>> {
    // await this.services.Auth.logoutFromAllSessions(req.cookies.user);

    res.clearCookie('user');

    return res.sendStatus(HttpStatusCodes.NO_CONTENT);
  }
}
