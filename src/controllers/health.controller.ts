import { IncomingMessage, ServerResponse } from 'http';

import { httpServerResponse } from '../utils';

export function health(req: IncomingMessage, res: ServerResponse) {
  httpServerResponse(res, 200, { message: 'ok' });
}
