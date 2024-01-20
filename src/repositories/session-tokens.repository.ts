import { Repository } from '@core/abstract/abstract.repository';
import { Knex } from 'knex';
import { SessionTokensEntities } from 'src/constants/enums/session-tokens/session-tokens-entities.enum';

// todo move to model
type CreateTokenData = {
  token: string;
  expiresAt: Date;
  userAgent: string;
};

export class SessionTokens extends Repository {
  protected tableName = 'session_tokens';

  constructor(knex: Knex) {
    super(knex);
  }

  public getTokenByEntityId(entity: SessionTokensEntities, entityId: number, userAgent: string)
    : Promise<{ token: string, expiresAt: Date }> {
    return this.knex
      .select('token')
      .from(this.tableName)
      .where({ entity, entity_id: entityId, user_agent: userAgent })
      .where('expires_at', '>', new Date())
      .first();
  }

  public create(entity: SessionTokensEntities, entityId: number, data: CreateTokenData): Promise<number[]> {
    return this.knex
      .insert({
        entity,
        entity_id: entityId,
        token: data.token,
        user_agent: data.userAgent,
        expires_at: data.expiresAt,
      })
      .into(this.tableName);
  }

  public deleteByToken(entity: SessionTokensEntities, token: string) {
    return this.knex
      .where({ entity, token })
      .from(this.tableName)
      .delete();
  }

  public deleteByEntityId(entity: SessionTokensEntities, entityId: number, exclude: string[] = []) {
    return this.knex
      .where({ entity, entity_id: entityId })
      .where(`token not in (${exclude})`)
      .from(this.tableName)
      .delete();
  }
}
