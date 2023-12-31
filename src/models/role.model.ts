import { RoleTypes } from '@constants';
import { Model } from '@core/abstract/abstract.model';

export class Role extends Model {
  public id!: number;

  public name!: string;

  public type!: RoleTypes;

  public isVisible!: boolean;

  public createdAt!: Date;

  public updatedAt!: Date;
}
