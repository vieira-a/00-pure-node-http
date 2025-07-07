import { z } from 'zod';

export const CreateCustomerSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
});

export type CreateCustomerDTO = z.infer<typeof CreateCustomerSchema>;
