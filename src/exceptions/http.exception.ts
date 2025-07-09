import { HttpCode } from '../enums';

export class HttpException extends Error {
  constructor(
    public readonly statusCode: number,
    public readonly message: string,
    public readonly code: HttpCode,
    public readonly details?: unknown,
    public resource?: string,
  ) {
    super(message);
  }
}
