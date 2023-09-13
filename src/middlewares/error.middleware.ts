import { HttpStatusCodes } from '@constants';
import { HttpException } from '@exceptions/HttpException';
import { logger } from '@utils/logger';
import { NextFunction, Request, Response } from 'express';

export const ErrorMiddleware = (error: HttpException, req: Request, res: Response, next: NextFunction) => {
  try {
    const status = error.status || HttpStatusCodes.INTERNAL_SERVER_ERROR;
    const message = error.message || 'Internal Server Error';
    const details = error.details || {};

    logger.error(`[${req.method}] ${req.path} ->> StatusCode: ${status}, Message: ${message}`);

    res.status(status).json({ message, details });
  } catch (error) {
    next(error);
  }
};
