import { NextFunction, Request, Response } from 'express';

import { HttpStatusCodes } from '../constants';
import { HttpException } from '../exceptions/http-exception';

export const NotFoundMiddleware = (req: Request, res: Response, next: NextFunction) => {
  res.status(404).json(
    new HttpException(HttpStatusCodes.NOT_FOUND, 'Not found', {
      path: req.path,
      method: req.method,
      host: req.headers.host,
      'user-agent': req.headers['user-agent'],
      ip: req.ip,
    })
  );
  next();
};
