import { Repository } from '@core/abstract/abstract.repository';
import { Knex } from 'knex';
import { logger } from 'utils/logger';

export class Roles extends Repository {
  constructor(knex: Knex) {
    super(knex, 'roles');
  }

  public async get() {
    try {
      await this.knex.select('1');
    } catch (err) {
      logger.error(err);
    }
  }
}
