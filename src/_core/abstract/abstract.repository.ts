import { Knex } from 'knex';

export abstract class Repository {
  protected knex: Knex;
  protected abstract tableName: string;

  constructor(knex: Knex) {
    this.knex = knex;
  }

  public transaction(): Promise<Knex.Transaction> {
    return this.knex.transaction();
  }

  protected getNewQueryBuilder(): Knex.QueryBuilder {
    return this.knex.from(this.tableName);
  }
}
