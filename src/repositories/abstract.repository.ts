import { Knex } from 'knex';

export abstract class Repository {
  protected knex: Knex;
  protected tableName: string;

  constructor(knex: Knex, tableName: string) {
    this.knex = knex;
    this.tableName = tableName;
  }

  protected getNewQueryBuilder(): Knex.QueryBuilder {
    return this.knex.from(this.tableName);
  }
}
