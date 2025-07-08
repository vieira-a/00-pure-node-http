import { HttpMethod } from '../enums';
import { jsonBodyParser } from '../utils';
import { IncomingRequest } from '../types';

export async function bodyParserMiddleware(req: IncomingRequest) {
  if (req.method === HttpMethod.POST || req.method === HttpMethod.PUT) {
    try {
      req.body = await jsonBodyParser(req);
    } catch (error) {
      throw error;
    }
  }
}
