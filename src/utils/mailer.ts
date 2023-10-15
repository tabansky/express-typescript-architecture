import { mailerConfig } from '@config';
import { createTransport } from 'nodemailer';

export const mailer = createTransport(mailerConfig);
