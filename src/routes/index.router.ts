import { ServerResponse } from 'http';

import { IncomingRequest } from '../types';
import { NotFoundException } from '../exceptions';
import { Container } from '../dependency-injection/container';
import { customerRouter } from './customer/customer.router';

export function mainRouter(container: Container) {
  const customerRoutes = customerRouter(container.resolve('CustomerController'));

  return async (req: IncomingRequest, res: ServerResponse) => {
    if (await customerRoutes(req, res)) return;

    throw new NotFoundException('Resource not found: ', { params: [`${req.method} ${req.url}`] });
  };
}
