import { IncomingMessage, ServerResponse } from 'http';

import { httpServerResponse } from '../utils';
import { HttpStatus } from '../enums';

export function health(req: IncomingMessage, res: ServerResponse) {
  httpServerResponse(res, HttpStatus.OK, { message: 'ok' });
}
