import { HttpStatusCodes } from '@core/constants';
import { NextFunction, Request, Response } from 'express';

import { HttpException } from './http-exception';

export const GlobalErrorHandler = (error: HttpException, req: Request, res: Response, _next: NextFunction) => {
  try {
    const status = error.status || HttpStatusCodes.INTERNAL_SERVER_ERROR;
    const message = error.message || 'Internal Server Error';
    const details = error.details || {};

    res.status(status).json({ status, message, details });
  } catch (error) {
    res.status(HttpStatusCodes.INTERNAL_SERVER_ERROR).json({ status: 500 });
  }
};
