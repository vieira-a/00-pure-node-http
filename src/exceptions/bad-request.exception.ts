import { HttpCode, HttpStatus } from '../enums';
import { HttpException } from './http.exception';

interface BadRequestDetails {
  params: string[];
}

export class BadRequestException extends HttpException {
  constructor(message: string, details?: BadRequestDetails) {
    super(HttpStatus.BAD_REQUEST, message, HttpCode.BAD_REQUEST, details);
  }
}
