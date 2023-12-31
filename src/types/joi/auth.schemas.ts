/**
 * This file was automatically generated by joi-to-typescript
 * Do not modify this file manually
 */

export interface AuthForgotBodyParams {
  type: 'password';
  value: string;
}

export interface ConfirmationQueryParams {
  email: string;
  token: string;
}

export interface LoginBodyParams {
  email: string;
  password: string;
  remember?: boolean;
}

export interface RegisterBodyParams {
  confirmPassword: any;
  email: string;
  password: string;
}
