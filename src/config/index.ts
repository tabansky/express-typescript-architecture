import { config } from 'dotenv';

config();

export * from './database.config';
export * from './swagger.config';
export * from './mailer.config';

export const CREDENTIALS = process.env.CREDENTIALS === 'true';
export const PORT = Number(process.env.PORT);
export const HOST = process.env.HOST;
export const NODE_ENV = process.env.NODE_ENV;
export const LOG_DIR = process.env.LOG_DIR;
