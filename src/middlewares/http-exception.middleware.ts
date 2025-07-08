import { ServerResponse } from 'http';

import { HttpExceptionType } from '../types';

export function httpExceptionMiddleware(res: ServerResponse, exception: HttpExceptionType) {
  res.statusCode = exception.statusCode;
  res.setHeader('Content-Type', 'application/json');
  res.end(
    JSON.stringify({
      error: {
        message: exception.message,
        code: exception.code,
        ...(exception.details ? { details: exception.details } : {}),
      },
      ...(exception.resource ? { resource: exception.resource } : {}),
    }),
  );
}
