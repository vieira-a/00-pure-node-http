import { CreateOrderDTO } from '../models/schemas/order.schema';
import { CustomerService } from './customer.service';
import { postgresPool } from '../database/postgres.pool';
import { InternalServerErrorException, NotFoundException } from '../exceptions';

export interface Order {
  id: string;
  customerId: string;
  product: string;
  amount: number;
  price: number;
  total: number;
}
export class OrderService {
  static async createOrder(data: CreateOrderDTO): Promise<Order> {
    const { customerId, product, amount, price, total } = data;

    const client = await postgresPool.connect();
    try {
      const customer = await CustomerService.getCustomerById(customerId);
      if (!customer) throw new NotFoundException('Customer not found');

      const id = crypto.randomUUID();

      const result = await client.query(
        'INSERT INTO orders (id, customer_id, product, amount, price, total) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
        [id, customerId, product, amount, price, total],
      );
      return result.rows[0] as Order;
    } catch (error) {
      throw new InternalServerErrorException(error);
    } finally {
      client.release();
    }
  }
}
