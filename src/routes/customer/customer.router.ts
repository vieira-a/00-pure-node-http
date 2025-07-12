import { IncomingRequest } from '../../types';
import { CustomerController } from '../../controllers/customer.controller';
import { ServerResponse } from 'http';
import { HttpMethod } from '../../enums';
import { CUSTOMER_ROUTES } from './customer.routes';
import { envConfig } from '../../configs/env-config';
import { CreateCustomerDTO } from '../../models/schemas/customer.schema';

const API_PREFIX = envConfig.application.API_PREFIX;

export function customerRouter(controller: CustomerController) {
  return async (req: IncomingRequest, res: ServerResponse): Promise<boolean> => {
    const createCustomerUrl = `${API_PREFIX}/${CUSTOMER_ROUTES.CREATE.resource}`;
    const createCustomerMethod = HttpMethod.POST;

    if (req.method === createCustomerMethod && req.url === createCustomerUrl) {
      await controller.createCustomer(req as IncomingRequest<CreateCustomerDTO>, res);
      return true;
    }

    return false;
  };
}
