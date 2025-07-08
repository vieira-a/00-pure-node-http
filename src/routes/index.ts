import { ServerResponse } from 'http';

import { IncomingRequest } from '../types';
import { healthRouter } from './health.routes';
import { NotFoundException } from '../exceptions';

export function mainRouter(req: IncomingRequest, res: ServerResponse) {
  if (healthRouter(req, res)) return;

  throw new NotFoundException('Resource not found');
}
