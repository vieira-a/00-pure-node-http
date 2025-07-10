import { IncomingMessage, ServerResponse } from 'http';

import { httpServerResponse } from '../utils';
import { HttpStatus } from '../enums';

export class HealthController {
  heathCheck(req: IncomingMessage, res: ServerResponse) {
    httpServerResponse(res, HttpStatus.OK, { message: 'API status: Ok' });
  }
}
