import { Repository } from '@core/abstract/abstract.repository';
import { Knex } from 'knex';
import { ConfirmationTokenActions } from 'src/constants/enums/confirmation-tokens.enum';
import { getHoursInMs } from 'src/helpers/time.helper';

export class ConfirmationTokens extends Repository {
  protected tableName = 'confirmation_tokens';

  constructor(knex: Knex) {
    super(knex);
  }

  public getTokenByUserId(userId: number, action: ConfirmationTokenActions): Promise<{ token: string, email: string }> {
    return this.knex
      .select('token', 'email')
      .from(this.tableName)
      .join('users', 'users.id', 'confirmation_tokens.user_id')
      .where({ user_id: userId, action })
      .where('expires_at', '>', new Date())
      .first();
  };

  public create(userId: number, token: string, action: ConfirmationTokenActions): Promise<void> {
    return this.knex
      .upsert({ user_id: userId, token, action, expires_at: new Date(Date.now() + getHoursInMs(2)) })
      .into(this.tableName);
  }

  public validateByToken(
    email: string,
    token: string,
    action: ConfirmationTokenActions
  ): Promise<{ expiresAt: Date, userId: number } | undefined> {
    return this.knex
      .select('expires_at as expiresAt')
      .select('user_id as userId')
      .from(this.tableName)
      .join('users', 'users.id', 'confirmation_tokens.user_id')
      .where({ 'users.email': email, action, token })
      .first();
  }
}
