import { Repository } from '@core/abstract/abstract.repository';
import { Knex } from 'knex';
import { User } from 'src/models/user.model';

export class Users extends Repository {
  protected tableName = 'users';

  constructor(knex: Knex) {
    super(knex);
  }

  public getByEmail(email: string): Promise<User | undefined> {
    return this.knex.select('*').from(this.tableName).where({ email: email }).first();
  }

  public create(email: string, password: string, roleId: number): Promise<number[]> {
    return this.knex
      .insert({ email, password, role_id: roleId })
      .into(this.tableName);
  }

  public updateById(id: number, data: Partial<User>): Promise<number> {
    return this.knex
      .update(data)
      .from(this.tableName)
      .where({ id });
  }
}
