import { IncomingMessage } from 'http';

export function jsonBodyParser(req: IncomingMessage): Promise<unknown> {
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
        console.error(error);
        reject(new Error('JSON inválido'));
      }
    });

    req.on('error', (err) => {
      reject(err);
    });
  });
}
