import { Request } from '@core/types';
import { NextFunction, Response } from 'express';
import StackTracey from 'stacktracey';

import { HttpException } from './http-exception';
import { logger } from '../../tools/logger';
import { HttpStatusCodes } from '../constants';

export const GlobalErrorHandler = (error: HttpException, req: Request, res: Response, _next: NextFunction) => {
  if (error instanceof HttpException) {
    return res.status(error.status).json({ status: error.status, message: error.message, details: error.details });
  }

  const err = error as Error;
  const stack = new StackTracey(err);

  logger.error(`${err.name}\n${stack.asTable()}`);

  res.status(HttpStatusCodes.INTERNAL_SERVER_ERROR).json({
    status: HttpStatusCodes.INTERNAL_SERVER_ERROR,
    message: err.message || 'Internal Server Error',
    details: err,
    trace: stack.items,
  });
};
