import { postgresPool } from '../database/postgres.pool';
import { CustomerService } from './customer.service';
import { CreateCustomerDTO } from '../models/schemas/customer.schema';

jest.mock('../database/postgres.pool');

describe('CustomerService', () => {
  const mockClient = {
    query: jest.fn(),
    release: jest.fn(),
  };

  const mockCustomer = {
    id: '16248f7b-1f30-4db3-957b-256f9b4ab6de',
    name: 'John Doe',
    email: 'john@example.com',
  };

  const mockInputCustomer: CreateCustomerDTO = {
    name: 'John Doe',
    email: 'john@example.com',
  };

  beforeEach(() => {
    jest.clearAllMocks();
    (postgresPool.connect as jest.Mock).mockResolvedValue(mockClient);
    jest.spyOn(crypto, 'randomUUID').mockReturnValue('16248f7b-1f30-4db3-957b-256f9b4ab6de');
  });

  it('should create a customer with valid params', async () => {
    mockClient.query.mockResolvedValue({ rows: [mockCustomer] });

    const result = await CustomerService.createCustomer(mockInputCustomer);

    expect(mockClient.query).toHaveBeenCalledWith(
      'INSERT INTO customers (id, name, email) VALUES ($1, $2, $3) RETURNING *',
      expect.arrayContaining([
        '16248f7b-1f30-4db3-957b-256f9b4ab6de',
        mockInputCustomer.name,
        mockInputCustomer.email,
      ]),
    );
    expect(result).toEqual(mockCustomer);
    expect(mockClient.release).toHaveBeenCalled();
  });

  it('should return customer data if customer exists', async () => {
    mockClient.query.mockResolvedValue({ rows: [mockCustomer] });

    const result = await CustomerService.getCustomerById('16248f7b-1f30-4db3-957b-256f9b4ab6de');

    expect(mockClient.query).toHaveBeenCalledWith(
      'SELECT id, name, email FROM customers WHERE id = $1',
      ['16248f7b-1f30-4db3-957b-256f9b4ab6de'],
    );

    expect(result).toEqual(mockCustomer);
    expect(mockClient.release).toHaveBeenCalled();
  });

  it('should return null if customer not exists', async () => {
    mockClient.query.mockResolvedValue({ rows: [] });

    const result = await CustomerService.getCustomerById('non-existent-id');

    expect(mockClient.query).toHaveBeenCalledWith(
      'SELECT id, name, email FROM customers WHERE id = $1',
      ['non-existent-id'],
    );

    expect(result).toEqual(null);
    expect(mockClient.release).toHaveBeenCalled();
  });

  it('should throw and release connection if CustomerService.createCustomer query fails', async () => {
    mockClient.query.mockRejectedValue(new Error('Database error.'));

    await expect(CustomerService.createCustomer(mockInputCustomer)).rejects.toThrow(
      'Failed to create customer',
    );

    expect(mockClient.query).toHaveBeenCalled();
    expect(mockClient.release).toHaveBeenCalled();
  });
});
