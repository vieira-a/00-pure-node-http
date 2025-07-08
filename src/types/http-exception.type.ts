import { HttpStatus, HttpCode } from '../enums';

export type HttpExceptionType = {
  statusCode: HttpStatus;
  message: string;
  code: HttpCode;
  details?: unknown;
  resource?: string;
};
