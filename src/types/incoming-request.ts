import { IncomingMessage } from 'http';

export type IncomingRequest = IncomingMessage & { body?: unknown };
