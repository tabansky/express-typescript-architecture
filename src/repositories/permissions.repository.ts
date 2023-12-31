import { Repository } from '@core/abstract/abstract.repository';
import { Knex } from 'knex';
import { logger } from 'tools/logger';

export class Permissions extends Repository {
  protected tableName = 'permissions';

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
