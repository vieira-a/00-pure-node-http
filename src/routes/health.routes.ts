import { ServerResponse } from 'http';

import { IncomingRequest } from '../types';
import { HttpMethod, HttpRouter } from '../enums';
import { health } from '../controllers/health.controller';

export function healthRouter(req: IncomingRequest, res: ServerResponse) {
  const { method, url } = req;

  if (method === HttpMethod.GET && url === HttpRouter.HEALTH) {
    health(req, res);
    return true;
  }
  return false;
}
