import { User, userCredentialAttributes } from 'src/models/user.model';

export type UserCredential = Pick<User, typeof userCredentialAttributes[number]>;
