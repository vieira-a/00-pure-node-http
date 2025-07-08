import { HttpCode, HttpStatus } from '../enums';
import { HttpException } from './http.exception';

interface NotFoundDetails {
  params: string[];
}

export class NotFoundException extends HttpException {
  constructor(message: string, details?: NotFoundDetails) {
    super(HttpStatus.NOT_FOUND, message, HttpCode.NOT_FOUND, details);
  }
}
