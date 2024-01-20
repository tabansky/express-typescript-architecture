import { Model } from '@core/abstract/abstract.model';

export class SessionToken extends Model {
  public id!: number;

  public token!: string;

  public userAgent!: string;

  public entity!: string;

  public entityId!: string;

  public expiresAt!: Date;

  public createdAt!: string;

  public updatedAt!: string;
}
