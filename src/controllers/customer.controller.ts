import { ServerResponse } from 'http';
import { CustomerService } from '../services';
import { IncomingRequest } from '../types';
import { CreateCustomerDTO, CreateCustomerSchema } from '../models/schemas/customer.schema';
import { httpServerResponse } from '../utils';
import { HttpStatus } from '../enums';
import { BadRequestException, HttpException, InternalServerErrorException } from '../exceptions';
import { validateBody } from '../configs/validation/validate-body';

export class CustomerController {
  constructor(private customerService: CustomerService) {}

  async createCustomer(req: IncomingRequest<CreateCustomerDTO>, res: ServerResponse) {
    if (!req.body) {
      throw new BadRequestException('Invalid request body');
    }

    try {
      const data = validateBody(CreateCustomerSchema, req.body);

      const result = await this.customerService.createCustomer(data);
      httpServerResponse(res, HttpStatus.CREATED, result);
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new InternalServerErrorException();
    }
  }
}
