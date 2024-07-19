import { HttpStatusCodes } from '@core/constants';
import { Request } from '@core/types';
import { HttpException } from '@core/utils/http-exception';

export const NotFoundMiddleware = (req: Request): void => {
  throw new HttpException(HttpStatusCodes.NOT_FOUND, 'Not found', {
    path: req.path,
    method: req.method,
    host: req.headers.host,
    'user-agent': req.headers['user-agent'],
    ip: req.ip,
  });
};
