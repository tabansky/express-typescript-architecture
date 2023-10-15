import { SessionOptions } from 'express-session';

import { getHoursInMs } from '../helpers/time.helper';

export const sessionConfig: SessionOptions = {
  secret: process.env.SECRET_KEY,
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.SESSION_SECURE === 'true' ? true : false,
    maxAge: getHoursInMs(Number(process.env.SESSION_EXPIRATION_HOURS) ?? 1),
  },
};
