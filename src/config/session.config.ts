import { SessionOptions } from 'express-session';

export const sessionConfig: SessionOptions = {
  secret: process.env.SECRET_KEY,
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.SESSION_SECURE === 'true' ? true : false,
    maxAge: (Number(process.env.SESSION_EXPIRATION_HOURS) ?? 1) * 60 * 60 * 1000,
  },
};
