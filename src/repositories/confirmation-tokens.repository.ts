import { Repository } from '@core/abstract/abstract.repository';
import { Knex } from 'knex';
import { logger } from 'tools/logger';

export class ConfirmationTokens extends Repository {
  protected tableName = 'confirmation_tokens';

  constructor(knex: Knex) {
    super(knex);
  }

  public async get() {
    try {
      await this.knex.select('1');
    } catch (err) {
      logger.error(err);
    }
  }

  public async validateByToken(email: string, token: string, action: string = 'confirm') {
    await this.knex
      .select()
      .join('users', 'users.id', 'confirmation_tokens.user_id')
      .where({ 'users.email': email, is_active: true, action, token })
      .first();
  }
}
