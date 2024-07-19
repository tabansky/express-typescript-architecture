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

  /**
   * Transforms array of attributes from camelCase to snake_case
   */
  protected associateAsField(attributes: string[], tableName: string = this.tableName): string[] {
    return attributes.map((attribute) => {
      const snake = attribute.replace(/([A-Z])/g, '_$1').toLowerCase();
      return `${tableName}.${snake} as ${attribute}`;
    });
  }

  /**
   * Transforms object keys from camelCase to snake_case
   */
  protected recordToSnakeCase<T extends Record<string, any>>(attributes: T): T {
    return Object.fromEntries(
      Object.entries(attributes).map(([key, value]) => [key.replace(/([A-Z])/g, '_$1').toLowerCase(), value]),
    ) as T;
  }
}
