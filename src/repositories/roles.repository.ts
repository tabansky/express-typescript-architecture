import { Repository } from '@core/abstract/abstract.repository';
import { Knex } from 'knex';
import { logger } from 'src/tools/logger';

export class Roles extends Repository {
  protected tableName = 'roles';

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
}
