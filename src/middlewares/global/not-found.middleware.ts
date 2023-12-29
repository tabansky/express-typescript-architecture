import { HttpStatusCodes } from '@core/constants';
import { HttpException } from '@core/handlers/http-exception';
import { Request } from 'express';

export const NotFoundMiddleware = (req: Request): void => {
  throw new HttpException(HttpStatusCodes.NOT_FOUND, 'Not found', {
    path: req.path,
    method: req.method,
    host: req.headers.host,
    'user-agent': req.headers['user-agent'],
    ip: req.ip,
  });
};
