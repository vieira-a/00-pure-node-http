import { OrderService } from './order.service';
import { postgresPool } from '../database/postgres.pool';
import { HttpCode, HttpStatus } from '../enums';
import { PoolClient } from 'pg';
import { CustomerService } from './customer.service';

jest.mock('../database/postgres.pool');

export type MockType<T> = {
  [P in keyof T]: jest.Mock;
};

describe('OrderService', () => {
  let mockClient: Partial<PoolClient>;
  let mockCustomerService: MockType<CustomerService>;
  let orderService: OrderService;

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

    mockClient = {
      query: jest.fn(),
      release: jest.fn(),
    };

    (postgresPool.connect as jest.Mock).mockResolvedValue(mockClient);

    mockCustomerService = {
      getCustomerById: jest.fn().mockResolvedValue({ id: mockInputOrder.customerId }),
      createCustomer: jest.fn(),
    };

    orderService = new OrderService(mockCustomerService);

    jest.spyOn(global.crypto, 'randomUUID').mockReturnValue('f4c83536-1b1a-473a-9d66-4fe93858b72a');
  });

  it('should create an order with valid params', async () => {
    (mockClient.query as jest.Mock).mockResolvedValueOnce({ rows: [mockOrder] });

    const result = await orderService.createOrder(mockInputOrder);

    expect(mockClient.query).toHaveBeenCalledWith(
      'INSERT INTO orders (id, customer_id, product, amount, price, total) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
      [
        mockOrder.id,
        mockInputOrder.customerId,
        mockInputOrder.product,
        mockInputOrder.amount,
        mockInputOrder.price,
        mockInputOrder.total,
      ],
    );

    expect(result).toEqual(mockOrder);
    expect(mockClient.release).toHaveBeenCalled();
  });

  it('should throw NotFoundException if customer is not found', async () => {
    mockCustomerService.getCustomerById.mockResolvedValue(null);

    await expect(orderService.createOrder(mockInputOrder)).rejects.toMatchObject({
      statusCode: HttpStatus.NOT_FOUND,
      code: HttpCode.NOT_FOUND,
      message: 'Customer not found',
    });

    expect(mockClient.release).toHaveBeenCalled();
  });

  it('should throw and release connection if query fails', async () => {
    (mockClient.query as jest.Mock).mockRejectedValue(new Error('Database error.'));

    await expect(orderService.createOrder(mockInputOrder)).rejects.toMatchObject({
      statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      code: HttpCode.INTERNAL_SERVER_ERROR,
    });

    expect(mockClient.release).toHaveBeenCalled();
  });
});
