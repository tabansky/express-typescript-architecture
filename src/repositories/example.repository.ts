import { Knex } from 'knex';

import { Repository } from '../_core/abstract/abstract.repository';
import { logger } from '../utils/logger';

export class ExampleRepository extends Repository {
  constructor(knex: Knex) {
    super(knex, 'example_table');
  }

  public async get() {
    try {
      await this.knex.select('1');
    } catch (err) {
      logger.error(err);
    }
  }
}
