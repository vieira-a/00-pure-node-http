import { postgresPool } from '../database/postgres.pool';
import { OrderService } from './order.service';

jest.mock('../database/postgres.pool');

describe('OrderService', () => {
  const mockClient = {
    query: jest.fn(),
    release: jest.fn(),
  };

  const mockOrder = {
    id: 'f4c83536-1b1a-473a-9d66-4fe93858b72a',
    customer_id: '16248f7b-1f30-4db3-957b-256f9b4ab6de',
    product: 'Product Test',
    amount: 2,
    price: 10,
    total: 20,
  };

  const mockInputOrder = {
    customerId: '16248f7b-1f30-4db3-957b-256f9b4ab6de',
    product: 'Product Test',
    amount: 2,
    price: 10,
    total: 20,
  };

  beforeEach(() => {
    jest.clearAllMocks();
    (postgresPool.connect as jest.Mock).mockResolvedValue(mockClient);
    jest.spyOn(crypto, 'randomUUID').mockReturnValue('f4c83536-1b1a-473a-9d66-4fe93858b72a');
  });

  it('should create a order with valid params', async () => {
    mockClient.query.mockResolvedValueOnce({ rows: [mockOrder] });

    const result = await OrderService.createOrder(mockInputOrder);

    expect(mockClient.query).toHaveBeenCalledWith(
      'INSERT INTO orders (id, customer_id, product, amount, price, total) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
      expect.arrayContaining([
        '16248f7b-1f30-4db3-957b-256f9b4ab6de',
        mockInputOrder.customerId,
        mockInputOrder.product,
        mockInputOrder.amount,
        mockInputOrder.price,
        mockInputOrder.total,
      ]),
    );
    expect(result).toEqual(mockOrder);
    expect(mockClient.release).toHaveBeenCalled();
  });
});
