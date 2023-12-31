import { Model } from '@core/abstract/abstract.model';

export class SessionToken extends Model {
  public id!: number;

  public token!: string;

  public entity!: string;

  public entityId!: string;

  public createdAt!: string;

  public updatedAt!: string;
}
