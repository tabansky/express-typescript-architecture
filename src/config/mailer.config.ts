const auth = {
  user: process.env.MAILER_USER,
  pass: process.env.MAILER_PASSWORD,
};

export const mailerConfig = {
  host: process.env.MAILER_HOST,
  port: Number(process.env.MAILER_PORT),
  secure: process.env.MAILER_SECURE === 'true' ? true : false,
  ...(auth.user ? { auth } : {}),
};
