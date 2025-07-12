import { z } from 'zod';

export const CreateCustomerSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
});

export const CustomerSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1),
  email: z.string().email(),
  created_at: z.string().datetime(),
  updated_at: z.string().datetime(),
});

export type CreateCustomerDTO = z.infer<typeof CreateCustomerSchema>;
export type CustomerModel = z.infer<typeof CustomerSchema>;
