import { UserCredential } from '../entities/user';

export type LoginCredentials = UserCredential & { token: string };
