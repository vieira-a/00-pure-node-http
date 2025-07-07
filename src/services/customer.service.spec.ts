import { postgresPool } from '../database/postgres.pool';
import { CustomerService } from './customer.service';
import { CreateCustomerDTO } from '../models/schemas/customer.schema';

jest.mock('../database/postgres.pool');

describe('CustomerService', () => {
  const mockClient = {
    query: jest.fn(),
    release: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
    (postgresPool.connect as jest.Mock).mockResolvedValue(mockClient);
    jest.spyOn(crypto, 'randomUUID').mockReturnValue('16248f7b-1f30-4db3-957b-256f9b4ab6de');
  });

  it('should create a customer with valid params', async () => {
    const mockCustomer = {
      id: '16248f7b-1f30-4db3-957b-256f9b4ab6de',
      name: 'John Doe',
      email: 'john@example.com',
    };

    mockClient.query.mockResolvedValue({ rows: [mockCustomer] });

    const input: CreateCustomerDTO = {
      name: 'John Doe',
      email: 'john@example.com',
    };

    const result = await CustomerService.createCustomer(input);

    expect(mockClient.query).toHaveBeenCalledWith(
      'INSERT INTO customers (id, name, email) VALUES ($1, $2, $3) RETURNING *',
      expect.arrayContaining(['16248f7b-1f30-4db3-957b-256f9b4ab6de', input.name, input.email]),
    );
    expect(result).toEqual(mockCustomer);
    expect(mockClient.release).toHaveBeenCalled();
  });
});
