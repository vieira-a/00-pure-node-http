import { IncomingMessage } from 'http';
import { BadRequestException } from '../exceptions';

export function jsonBodyParser(req: IncomingMessage & { body?: unknown }): Promise<unknown> {
  return new Promise((resolve, reject) => {
    let body = '';

    req.on('data', (chunk: Buffer) => {
      body += chunk.toString();
    });

    req.on('end', () => {
      try {
        const json: unknown = JSON.parse(body);
        resolve(json);
      } catch (error: unknown) {
        console.log(error);
        reject(new BadRequestException('Invalid param', { params: ['body'] }));
      }
    });

    req.on('error', (err) => {
      reject(err);
    });
  });
}
