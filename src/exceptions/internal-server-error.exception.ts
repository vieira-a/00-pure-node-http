import { envConfig } from '../configs/env-config';
import { HttpCode, HttpStatus } from '../enums';
import { HttpException } from './http.exception';

export class InternalServerErrorException extends HttpException {
  constructor(error?: Error) {
    super(
      HttpStatus.INTERNAL_SERVER_ERROR,
      'Internal server error',
      HttpCode.INTERNAL_SERVER_ERROR,
      error
        ? {
            message: error.message,
            stack: envConfig.application.env === 'development' ? error.stack : undefined,
            name: error.name,
          }
        : undefined,
    );
  }
}
