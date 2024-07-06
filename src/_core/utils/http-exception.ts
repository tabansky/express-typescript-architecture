import { HttpStatusCodes } from '../constants';

export class HttpException extends Error {
  public status: HttpStatusCodes;
  public message: string;
  public details: Record<string, unknown>;

  public stack?: any;

  constructor(status: HttpStatusCodes, message: string, details: Record<string, unknown> = {}) {
    super(message);

    this.status = status;
    this.message = message;
    this.details = details;
  }
}
