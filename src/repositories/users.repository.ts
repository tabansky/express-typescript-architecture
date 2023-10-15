import { Knex } from 'knex';

import { Repository } from '../_core/abstract/abstract.repository';

export class Users extends Repository {
  constructor(knex: Knex) {
    super(knex, 'users');
  }

  public async getByEmail(email: string): Promise<any> {
    return this.knex.select('*').where({ email: email }).first();
  }
}
