import { NextFunction, Request, Response } from 'express';
import { logger } from 'src/tools/logger';

import { HttpException } from './http-exception';
import { HttpStatusCodes } from '../constants/index';

export const GlobalErrorHandler = (error: HttpException, req: Request, res: Response, _next: NextFunction) => {
  if (error instanceof HttpException) {
    return res.status(error.status).json({ status: error.status, message: error.message, details: error.details });
  }

  const err = error as Error;
  logger.error(`${err.message}\n${err.stack}`);

  res.status(HttpStatusCodes.INTERNAL_SERVER_ERROR)
    .json({ status: HttpStatusCodes.INTERNAL_SERVER_ERROR, message: 'Internal Server Error', details: err.stack });
};
