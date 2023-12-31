import { Repository } from '@core/abstract/abstract.repository';
import { Knex } from 'knex';

export class Users extends Repository {
  protected tableName = 'users';

  constructor(knex: Knex) {
    super(knex);
  }

  public async getByEmail(email: string): Promise<any> {
    return this.knex.select('*').where({ email: email }).first();
  }

  public async create(email: string, password): Promise<any> {
    return this.knex.insert('*');
  }
}
