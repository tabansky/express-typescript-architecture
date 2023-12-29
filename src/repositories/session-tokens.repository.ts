import { Repository } from '@core/abstract/abstract.repository';
import { Knex } from 'knex';
import { SessionToken } from 'models/session-token.model';

export class SessionTokens extends Repository {
  constructor(knex: Knex) {
    super(knex, 'session_tokens');
  }

  public async create(data: SessionToken) {
    return this.knex.insert(data.toSnakeCase(data));
  }

  public async delete(token: string) {
    return this.knex.where({ token }).delete();
  }
}
