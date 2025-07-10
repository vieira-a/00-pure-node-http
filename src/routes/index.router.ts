import { ServerResponse } from 'http';

import { IncomingRequest } from '../types';
import { NotFoundException } from '../exceptions';
import { Container } from '../dependency-injection/container';
import { customerRouter } from './customer/customer.router';
import { healthRouter } from './health/health.router';

export function mainRouter(container: Container) {
  const customerRoutes = customerRouter(container.resolve('CustomerController'));
  const healthController = healthRouter(container.resolve('HealthController'));

  return async (req: IncomingRequest, res: ServerResponse) => {
    if (await customerRoutes(req, res)) return;
    if (healthController(req, res)) return;
    throw new NotFoundException('Resource not found: ', { params: [`${req.method} ${req.url}`] });
  };
}
