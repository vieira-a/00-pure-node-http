import { IncomingMessage, ServerResponse } from 'http';

import { bodyParserMiddleware } from './middlewares';
import { mainRouter } from './routes';
import { HttpException } from './types';
import { HttpStatus } from './enums';
import { httpServerErrorResponse } from './utils';

type IncomingRequest = IncomingMessage & { body?: unknown };

function isHttpException(error: unknown): error is HttpException {
  if (typeof error !== 'object' || error === null) return false;

  const err = error as Record<string, unknown>;

  return typeof err.statusCode === 'number' && typeof err.message === 'string';
}

async function routerHandlerAsync(req: IncomingRequest, res: ServerResponse) {
  await bodyParserMiddleware(req);
  mainRouter(req, res);
}

export function routerHandler(req: IncomingRequest, res: ServerResponse) {
  routerHandlerAsync(req, res).catch((error: unknown) => {
    console.error(error);

    if (isHttpException(error)) {
      httpServerErrorResponse(res, error);
    } else {
      httpServerErrorResponse(res, {
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: 'Internal server error',
      });
    }
  });
}
