import { CreateCustomerDTO } from '../models/schemas/customer.schema';
import { postgresPool } from '../database/postgres.pool';

export interface Customer {
  id: string;
  name: string;
  email: string;
}

export class CustomerService {
  static async createCustomer(data: CreateCustomerDTO): Promise<Customer> {
    const { name, email } = data;
    const id = crypto.randomUUID();

    const client = await postgresPool.connect();

    try {
      const result = await client.query(
        'INSERT INTO customers (id, name, email) VALUES ($1, $2, $3) RETURNING *',
        [id, name, email],
      );

      return result.rows[0] as Customer;
    } catch (error) {
      console.error('Error creating customer:', error);
      throw new Error('Failed to create customer');
    } finally {
      client.release();
    }
  }
}
