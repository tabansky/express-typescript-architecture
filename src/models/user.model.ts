import { UserTypes } from '@constants';
import { Model } from '@core/abstract/abstract.model';

export const userCredentialAttributes = [ 'id', 'email', 'roleId', 'state', 'type' ] as const;

export class User extends Model {
  public id!: number;

  public name!: string;

  public email!: string;

  public password!: string;

  public state!: string;

  public type!: UserTypes;

  public roleId!: number;

  public createdAt!: string;

  public updatedAt!: string;
}
