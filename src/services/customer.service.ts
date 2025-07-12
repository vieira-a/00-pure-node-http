import { CreateCustomerDTO, CustomerModel } from '../models/schemas/customer.schema';
import { postgresPool } from '../database/postgres.pool';
import { InternalServerErrorException } from '../exceptions';

export interface Customer {
  id: string;
  name: string;
  email: string;
}

export class CustomerService {
  async createCustomer(data: CreateCustomerDTO): Promise<CustomerModel> {
    const { name, email } = data;
    const client = await postgresPool.connect();

    try {
      const id = crypto.randomUUID();
      const result = await client.query(
        'INSERT INTO customers (id, name, email) VALUES ($1, $2, $3) RETURNING *',
        [id, name, email],
      );

      return result.rows[0] as CustomerModel;
    } catch (error) {
      throw new InternalServerErrorException(error as Error);
    } finally {
      client.release();
    }
  }

  async getCustomerById(customerId: string): Promise<CustomerModel | null> {
    const client = await postgresPool.connect();

    try {
      const result = await client.query('SELECT id, name, email FROM customers WHERE id = $1', [
        customerId,
      ]);

      return (result.rows[0] as CustomerModel) || null;
    } catch (error) {
      throw new InternalServerErrorException(error as Error);
    } finally {
      client.release();
    }
  }
}
