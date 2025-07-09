import { IncomingMessage } from 'http';

export type IncomingRequest<T = unknown> = IncomingMessage & { body?: T };
