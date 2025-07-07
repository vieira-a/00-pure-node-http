import { ServerResponse } from 'http';

import { HttpException } from '../types';

export function httpServerErrorResponse(res: ServerResponse, exception: HttpException) {
  res.statusCode = exception.statusCode;
  res.setHeader('Content-Type', 'application/json');
  res.end(
    JSON.stringify({
      error: exception.message,
      ...(exception.details ? { details: exception.details } : {}),
    }),
  );
}
