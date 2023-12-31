import crypto from 'crypto';

import { getHoursInMs } from './time.helper';

export const generateBearerToken = (): string => {
  return crypto.randomBytes(255).toString('base64');
};

export const getTokenValidityHours = (remember: boolean): number => {
  if (remember) {
    return getHoursInMs(72);
  }

  return getHoursInMs(24);
};
