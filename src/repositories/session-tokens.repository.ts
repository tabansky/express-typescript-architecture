import { SessionToken } from '@models/session-token.model';
import { Knex } from 'knex';

import { Repository } from '../_core/abstract/abstract.repository';

export class SessionTokens extends Repository {
  constructor(knex: Knex) {
    super(knex, 'session_tokens');
  }

  public async create(data: SessionToken) {
    return this.knex.insert(data.toSnakeCase(data));
  }
}
