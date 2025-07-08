import { ServerResponse } from 'http';
import { HttpStatus } from '../enums';

export function httpServerResponse(res: ServerResponse, statusCode: HttpStatus, data: unknown) {
  res.statusCode = statusCode;
  res.setHeader('Content-Type', 'application/json');
  res.end(JSON.stringify(data));
}
