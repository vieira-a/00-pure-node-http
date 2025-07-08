import { CustomerService, OrderService } from './';
import { postgresPool } from '../database/postgres.pool';

jest.mock('./customer.service');
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
    (CustomerService.getCustomerById as jest.Mock).mockResolvedValue({
      id: mockInputOrder.customerId,
    });
    jest.spyOn(crypto, 'randomUUID').mockReturnValue('f4c83536-1b1a-473a-9d66-4fe93858b72a');
  });

  it('should create a order with valid params', async () => {
    mockClient.query.mockResolvedValueOnce({ rows: [mockOrder] });

    const result = await OrderService.createOrder(mockInputOrder);

    expect(mockClient.query).toHaveBeenCalled();
    expect(result).toEqual(mockOrder);
  });

  it('should throw if customer is not found', async () => {
    (CustomerService.getCustomerById as jest.Mock).mockResolvedValue(null);

    await expect(OrderService.createOrder(mockInputOrder)).rejects.toThrow('Customer not found');
  });

  it('should throw and release connection if OrderService.createOrder query fails', async () => {
    mockClient.query.mockRejectedValue(new Error('Database error.'));

    await expect(OrderService.createOrder(mockInputOrder)).rejects.toThrow(
      'Failed to create order',
    );

    expect(mockClient.query).toHaveBeenCalled();
    expect(mockClient.release).toHaveBeenCalled();
  });
});
