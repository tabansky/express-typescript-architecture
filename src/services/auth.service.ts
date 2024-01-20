import { UserStates } from '@constants';
import { Service } from '@core/abstract/abstract.service';
import { HttpStatusCodes } from '@core/constants';
import { HttpException } from '@core/handlers/http-exception';
import { LoginCredentials } from '@types';
import { compare, hash } from 'bcrypt';
import { MailSender } from 'src/components/mail-sender';
import { ConfirmationTokenActions } from 'src/constants/enums/confirmation-tokens.enum';
import { SessionTokensEntities } from 'src/constants/enums/session-tokens/session-tokens-entities.enum';
import { generateBearerToken, generateConfirmationToken, getTokenValidityHours } from 'src/helpers/auth.helper';

export class AuthService extends Service {
  public async sendEmailConfirmationToken(userId: number, action: ConfirmationTokenActions): Promise<void> {
    const { ConfirmationTokens } = this.app.get('repositories');

    const { token, email } = await ConfirmationTokens.getTokenByUserId(userId, action);
    if (!token) {
      throw new HttpException(HttpStatusCodes.NOT_FOUND, 'No confirmation token found');
    }

    await MailSender.send(email, action, { token, email });
  }

  public async register(email: string, password: string): Promise<void> {
    const { Users, ConfirmationTokens } = this.app.get('repositories');
    const transaction = await Users.transaction();

    try {
      const userExists = await Users.getByEmail(email);
      if (userExists) {
        throw new HttpException(HttpStatusCodes.BAD_REQUEST, 'User already exists');
      }

      const hashedPassword = await hash(password, 10);
      const confirmationToken = generateConfirmationToken();

      const [userId] = await Users.create(email, hashedPassword, 1);

      await ConfirmationTokens.create(userId, confirmationToken, ConfirmationTokenActions.CONFIRM_EMAIL);
      await this.sendEmailConfirmationToken(userId, ConfirmationTokenActions.CONFIRM_EMAIL);

      await transaction.commit();
    } catch (err) {
      await transaction.rollback();
      throw err;
    }
  }

  public async login(
    email: string,
    password: string,
    remember: boolean,
    userAgent: string = '',
  ): Promise<LoginCredentials> {
    const { SessionTokens, Users } = this.app.get('repositories');

    const user = await Users.getByEmail(email);
    const isSamePassword = compare(password, user?.password as string);

    if (!user || !isSamePassword) {
      throw new HttpException(HttpStatusCodes.UNAUTHORIZED, 'Incorrect email or password');
    }

    if (user.state !== UserStates.ACTIVE) {
      throw new HttpException(HttpStatusCodes.UNAUTHORIZED, 'User is not active');
    }

    const { id, roleId, state, type } = user;
    const activeToken = await SessionTokens.getTokenByEntityId(SessionTokensEntities.USER, user.id, userAgent);

    if (activeToken) {
      return { token: activeToken.token, id, email, roleId, state, type };
    }

    const token = generateBearerToken();
    const expiresAt = new Date(new Date().getTime() + getTokenValidityHours(remember));

    await SessionTokens.create(SessionTokensEntities.USER, user.id, { token, expiresAt, userAgent });

    return { token, id, email, roleId, state, type };
  }

  public async validateConfirmationToken(
    email: string,
    token: string,
    action: ConfirmationTokenActions,
  ): Promise<boolean> {
    const { ConfirmationTokens } = this.app.get('repositories');

    const found = await ConfirmationTokens.validateByToken(email, token, action);

    if (!found || found.expiresAt < new Date()) {
      return false;
    }

    return true;
  }

  public async confirmEmail(email: string, token: string): Promise<void> {
    const { Users, ConfirmationTokens } = this.app.get('repositories');

    const found = await ConfirmationTokens.validateByToken(email, token, ConfirmationTokenActions.CONFIRM_EMAIL);
    if (!found) {
      throw new HttpException(HttpStatusCodes.NOT_FOUND, 'User or token not valid');
    }

    await Users.updateById(found.userId, { state: UserStates.ACTIVE });
  }

  public async forgot(email: string): Promise<void> {
    const { Users, ConfirmationTokens } = this.app.get('repositories');

    const user = await Users.getByEmail(email);
    if (!user) {
      throw new HttpException(HttpStatusCodes.NOT_FOUND, 'User not found');
    }

    const confirmationToken = generateConfirmationToken();
    await ConfirmationTokens.create(user.id, confirmationToken, ConfirmationTokenActions.RESET_PASSWORD);

    await this.sendEmailConfirmationToken(user.id, ConfirmationTokenActions.RESET_PASSWORD);
  }

  public async logoutFromAllSessions(userId: number, exclude?: string[]): Promise<void> {
    const { SessionTokens } = this.app.get('repositories');

    await SessionTokens.deleteByEntityId(SessionTokensEntities.USER, userId, exclude);
  }
}
