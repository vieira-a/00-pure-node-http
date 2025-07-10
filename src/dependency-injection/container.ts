import { DomainException } from '../exceptions';
import { CustomerController } from '../controllers/customer.controller';
import { HealthController } from '../controllers/health.controller';
import { CustomerService } from '../services';

export class Container {
  private service = new Map();

  constructor() {
    const customerService = new CustomerService();
    this.service.set('HealthController', new HealthController());
    this.service.set('CustomerController', new CustomerController(customerService));
  }

  resolve<T>(key: string): T {
    const service = this.service.get(key) as T;

    if (!service) {
      throw new DomainException('Injection dependency service not found');
    }

    return service;
  }
}
