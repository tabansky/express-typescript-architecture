import { Service } from '@core/abstract/abstract.service';
import { HttpStatusCodes } from '@core/constants';
import { HttpException } from '@core/handlers/http-exception';
import { LoginBodyData } from '@types';
import { compare, hash, genSalt } from 'bcrypt';

import { generateBearerToken, getTokenValidityHours } from '../helpers/auth.helper';

export class AuthService extends Service {
  public async register({ email, password }: LoginBodyData): Promise<string> {
    const { SessionTokens, Users } = this.app.get('repositories');

    const salt = await genSalt(10);
    const hashedPassword = await hash(password, salt);

    const user = await Users.create(email, hashedPassword);

    const token = generateBearerToken();
    const expires = new Date(new Date().getTime() + getTokenValidityHours(false));

    // await SessionTokens.create({ id: user.id, token, expires });

    return token;
  }

  public async login({ email, password, remember }: LoginBodyData): Promise<string> {
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
}
