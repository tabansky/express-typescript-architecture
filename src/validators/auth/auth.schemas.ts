import Joi from 'joi';

import { ConfirmationTokenActions } from '../../constants/enums/confirmation-tokens.enum';

export const confirmationSchema = Joi.object({
  email: Joi.string().email().required(),
  token: Joi.string().required(),
  action: Joi.string().valid(...Object.values(ConfirmationTokenActions)).required(),
}).meta({ className: 'ConfirmationQueryParams' });

export const forgotSchema = Joi.object({
  email: Joi.string().email().required(),
}).meta({ className: 'AuthForgotPasswordBodyParams' });

export const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
  remember: Joi.boolean().optional(),
}).meta({ className: 'LoginBodyParams' });

export const registerSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
  confirmPassword: Joi.any().valid(Joi.ref('password')).required(),
}).meta({ className: 'RegisterBodyParams' });
