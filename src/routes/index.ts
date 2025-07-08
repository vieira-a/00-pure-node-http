import { ServerResponse } from 'http';

import { envConfig } from '../configs/env-config';
import { IncomingRequest } from '../types';
import { NotFoundException } from '../exceptions';
import { healthRouter } from './health.routes';

export function mainRouter(req: IncomingRequest, res: ServerResponse) {
  const prefix = `/api/${envConfig.API_VERSION}`;

  if (!req.url?.startsWith(prefix)) {
    throw new NotFoundException('Resource not found');
  }

  req.url = req.url.slice(prefix.length) || '/';

  if (healthRouter(req, res)) return;

  throw new NotFoundException('Resource not found');
}
