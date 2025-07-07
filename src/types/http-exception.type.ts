import { HttpStatus } from '../enums';

export type HttpException = {
  statusCode: HttpStatus;
  message: string;
  details?: unknown;
};
