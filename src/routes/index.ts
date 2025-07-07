import { ServerResponse } from 'http';

import { IncomingRequest } from '../types';
import { httpServerResponse } from '../utils';
import { healthRouter } from './health.routes';

export function mainRouter(req: IncomingRequest, res: ServerResponse) {
  if (healthRouter(req, res)) return;

  httpServerResponse(res, 400, { error: 'Not found' });
}
