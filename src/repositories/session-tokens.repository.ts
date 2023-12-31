import { Repository } from '@core/abstract/abstract.repository';
import { Knex } from 'knex';

export class SessionTokens extends Repository {
  protected tableName = 'session_tokens';

  constructor(knex: Knex) {
    super(knex);
  }

  public async delete(token: string) {
    return this.knex.where({ token }).delete();
  }
}
