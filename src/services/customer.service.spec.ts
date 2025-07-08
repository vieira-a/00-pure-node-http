import { postgresPool } from '../database/postgres.pool';
import { CustomerService } from './customer.service';
import { CreateCustomerDTO } from '../models/schemas/customer.schema';
import { HttpCode, HttpStatus } from '../enums';

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

  let customerService: CustomerService;

  beforeEach(() => {
    jest.clearAllMocks();
    (postgresPool.connect as jest.Mock).mockResolvedValue(mockClient);
    jest.spyOn(crypto, 'randomUUID').mockReturnValue('16248f7b-1f30-4db3-957b-256f9b4ab6de');

    customerService = new CustomerService();
  });

  it('should create a customer with valid params', async () => {
    mockClient.query.mockResolvedValue({ rows: [mockCustomer] });

    const result = await customerService.createCustomer(mockInputCustomer);

    expect(mockClient.query).toHaveBeenCalledWith(
      'INSERT INTO customers (id, name, email) VALUES ($1, $2, $3) RETURNING *',
      [mockCustomer.id, mockInputCustomer.name, mockInputCustomer.email],
    );
    expect(result).toEqual(mockCustomer);
    expect(mockClient.release).toHaveBeenCalled();
  });

  it('should return customer data if customer exists', async () => {
    mockClient.query.mockResolvedValue({ rows: [mockCustomer] });

    const result = await customerService.getCustomerById(mockCustomer.id);

    expect(mockClient.query).toHaveBeenCalledWith(
      'SELECT id, name, email FROM customers WHERE id = $1',
      [mockCustomer.id],
    );
    expect(result).toEqual(mockCustomer);
    expect(mockClient.release).toHaveBeenCalled();
  });

  it('should return null if customer does not exist', async () => {
    mockClient.query.mockResolvedValue({ rows: [] });

    const result = await customerService.getCustomerById('non-existent-id');

    expect(mockClient.query).toHaveBeenCalledWith(
      'SELECT id, name, email FROM customers WHERE id = $1',
      ['non-existent-id'],
    );
    expect(result).toBeNull();
    expect(mockClient.release).toHaveBeenCalled();
  });

  it('should throw InternalServerErrorException if createCustomer query fails', async () => {
    mockClient.query.mockRejectedValue(new Error('Database error.'));

    await expect(customerService.createCustomer(mockInputCustomer)).rejects.toMatchObject({
      statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      code: HttpCode.INTERNAL_SERVER_ERROR,
    });

    expect(mockClient.query).toHaveBeenCalled();
    expect(mockClient.release).toHaveBeenCalled();
  });

  it('should throw InternalServerErrorException if getCustomerById query fails', async () => {
    mockClient.query.mockRejectedValue(new Error('Database error.'));

    await expect(customerService.getCustomerById(mockCustomer.id)).rejects.toMatchObject({
      statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      code: HttpCode.INTERNAL_SERVER_ERROR,
    });

    expect(mockClient.query).toHaveBeenCalled();
    expect(mockClient.release).toHaveBeenCalled();
  });
});
