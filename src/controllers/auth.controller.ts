import { Controller } from '@core/abstract/abstract.controller';
import { HttpStatusCodes } from '@core/constants';
import { Application } from '@core/declarations';
import { Request } from '@core/types';
import { AuthForgotPasswordBodyParams, ConfirmationQueryParams, LoginBodyParams, RegisterBodyParams } from '@types';
import { Response } from 'express';
import { ClientRedirects } from 'src/constants/enums/client-redirects.enum';
import { ConfirmationTokenActions } from 'src/constants/enums/confirmation-tokens.enum';
import { SessionTokensEntities } from 'src/constants/enums/session-tokens/session-tokens-entities.enum';

import { getHoursInMs } from '../helpers/time.helper';

export class AuthController extends Controller {
  constructor(app: Application) {
    super(app);
  }

  /**
   * @warn Query params may serialize base64 token incorrectly.
   * @abstract Creates session token using user credentials.
   * The session token stores in DB and temporarily in cookies.
   * When the session token is expired in cookies it will be searched in database,
   * in case of the session token is expired in database too - throw exception.
   */

  /**
   * @description Creates new user and sends email for account confirmation.
   */
  public async register(req: Request<{ body: RegisterBodyParams }>, res: Response): Promise<Response<void>> {
    const { email, password } = req.body;

    await this.services.Auth.register(email, password);

    return res.status(HttpStatusCodes.SEE_OTHER).json({ redirectTo: ClientRedirects.EMAIL });
  }

  /**
   * @description Creates session token using user credentials.
   * The session token stores in DB and temporarily in cookies.
   * @returns cookies with status created (201)
   */
  public async login(req: Request<{ body: LoginBodyParams }>, res: Response): Promise<Response<void>> {
    const { email, password, remember = false } = req.body;
    const userAgent = req.get('User-Agent')?.trim();

    if (req.cookies.user) {
      return res.sendStatus(HttpStatusCodes.FOUND);
    }

    const tokenData = await this.services.Auth.login(email, password, remember, userAgent);
    res.cookie('user', tokenData, { maxAge: getHoursInMs(2) });

    return res.sendStatus(HttpStatusCodes.SEE_OTHER).json({ redirectTo: ClientRedirects.HOME });
  }

  /**
   * @description Checks action confirmation token and returns boolean value.
   */
  public async validateConfirmationToken(
    req: Request<{ body: ConfirmationQueryParams }>,
    res: Response
  ): Promise<Response<{ valid: boolean }>> {
    const { email, token, action } = req.body;

    const valid = await this.services.Auth.validateConfirmationToken(email, token, action as ConfirmationTokenActions);

    return res.status(HttpStatusCodes.OK).json({ valid });
  }

  /**
   * @description Validates action token and confirm selected action.
   */
  public async confirm(req: Request<{ body: ConfirmationQueryParams }>, res: Response): Promise<Response<void>> {
    const { email, token } = req.body;

    await this.services.Auth.confirmEmail(email, token);

    return res.status(HttpStatusCodes.FOUND).json({ redirectTo: ClientRedirects.LOGIN });
  }

  /**
   * @description Requests to restore access to a user account.
   */
  public async forgot(req: Request<{ body: AuthForgotPasswordBodyParams }>, res: Response): Promise<Response<void>> {
    const { email } = req.body;

    await this.services.Auth.forgot(email);

    return res.sendStatus(HttpStatusCodes.NO_CONTENT);
  }

  /**
   * @description Logging out from current session.
   */
  public async logout(req: Request, res: Response): Promise<Response<void>> {
    const { SessionTokens } = this.app.get('repositories');

    await SessionTokens.deleteByToken(SessionTokensEntities.USER, req.cookies.user.token);
    res.clearCookie('user');

    return res.status(HttpStatusCodes.SEE_OTHER).json({ redirectTo: ClientRedirects.HOME });
  }

  /**
   * @description Logging out from sessions on all devices excluding current.
   */
  public async logoutAllOtherSessions(req: Request, res: Response): Promise<Response<void>> {
    if (!req.cookies.user) {
      return res.sendStatus(HttpStatusCodes.UNAUTHORIZED);
    }

    await this.services.Auth.logoutFromAllSessions(req.cookies.user.id, [req.cookies.user.token]);

    return res.sendStatus(HttpStatusCodes.NO_CONTENT);
  }
}
