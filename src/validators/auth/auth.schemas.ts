import Joi from 'joi';

export const confirmationSchema = Joi.object({
  email: Joi.string().email().required(),
  token: Joi.string().required(),
}).meta({ className: 'ConfirmationQueryParams' });

export const forgotSchema = Joi.object({
  type: Joi.string().valid('password').required(),
  value: Joi.alternatives().try(
    Joi.string().email().required(),
  ),
}).meta({ className: 'AuthForgotBodyParams' });

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
