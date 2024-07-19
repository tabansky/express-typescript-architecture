import { Repository } from '@core/abstract/repository';
import { Knex } from 'knex';

import { logger } from '../tools/logger';

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
