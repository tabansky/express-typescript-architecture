import { Service } from '@core/abstract/abstract.service';
import { HttpStatusCodes } from '@core/constants';
import { HttpException } from '@core/handlers/http-exception';
import { compare, hash } from 'bcrypt';
import { generateBearerToken, getTokenValidityHours } from 'helpers/auth.helper';
import { mailer } from 'tools/mailer';

export class AuthService extends Service {
  public async validateConfirmationToken(email: string, token: string): Promise<boolean> {
    const { ConfirmationTokens } = this.app.get('repositories');

    await ConfirmationTokens.validateByToken(email, token);

    return true;
  }

  public async register(email: string, password: string): Promise<void> {
    const { Users } = this.app.get('repositories');

    const hashedPassword = await hash(password, 10);
    const newUser = await Users.create(email, hashedPassword);

    await mailer.sendMail({
      from: 'App',
      to: email,
      subject: 'New user',
      html: `${newUser.id}`,
    });
  }

  public async forgot() {

  }

  // todo: implement
  public async confirmEmail(email: string, token: string): Promise<void> {
    const { Users } = this.app.get('repositories');
  }

  public async login(email: string, password: string, remember = false): Promise<string> {
    const { SessionTokens, Users } = this.app.get('repositories');

    const user = await Users.getByEmail(email);
    const isSamePassword = await compare(password, user?.password);

    if (!isSamePassword) {
      throw new HttpException(HttpStatusCodes.UNAUTHORIZED, 'Incorrect user or password');
    }

    const token = generateBearerToken();
    const expires = new Date(new Date().getTime() + getTokenValidityHours(remember));

    // await SessionTokens.create({ id: user.id, token, expires });

    return token;
  }

  public async logoutFromAllSessions(): Promise<void> {

  }
}
