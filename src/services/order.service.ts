import { CreateOrderDTO } from '../models/schemas/order.schema';
import { postgresPool } from '../database/postgres.pool';

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
    const id = crypto.randomUUID();

    const client = await postgresPool.connect();

    try {
      const result = await client.query(
        'INSERT INTO orders (id, customer_id, product, amount, price, total) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
        [id, customerId, product, amount, price, total],
      );

      return result.rows[0] as Order;
    } catch (error) {
      console.error('Error creating order:', error);
      throw new Error('Failed to create order');
    } finally {
      client.release();
    }
  }
}
