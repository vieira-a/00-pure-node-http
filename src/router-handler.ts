import { IncomingMessage, ServerResponse } from 'http';

import { bodyParserMiddleware } from './middlewares';
import { mainRouter } from './routes';
import { httpExceptionMiddleware } from './middlewares';
import { HttpException, InternalServerErrorException } from './exceptions';

type IncomingRequest = IncomingMessage & { body?: unknown };

async function routerHandlerAsync(req: IncomingRequest, res: ServerResponse) {
  await bodyParserMiddleware(req);
  mainRouter(req, res);
}

export function routerHandler(req: IncomingRequest, res: ServerResponse) {
  routerHandlerAsync(req, res).catch((error: unknown) => {
    const resource = `${req.method} ${req.url}`;

    if (error instanceof HttpException) {
      if (!error.resource) {
        error.resource = resource;
      }
      httpExceptionMiddleware(res, error);
    } else {
      const internalServerError = new InternalServerErrorException(error as Error);
      internalServerError.resource = resource;
      httpExceptionMiddleware(res, internalServerError);
    }
  });
}
