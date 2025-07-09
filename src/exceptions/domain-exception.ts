import { HttpCode, HttpStatus } from '../enums';
import { HttpException } from './http.exception';

interface DomainExceptionDetails {
  params: string[];
}

export class DomainException extends HttpException {
  constructor(message: string, details?: DomainExceptionDetails) {
    super(HttpStatus.UNPROCESSABLE_ENTITY, message, HttpCode.UNPROCESSABLE_ENTITY, details);
  }
}
