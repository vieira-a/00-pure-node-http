import { z } from 'zod';

export const CreateOrderSchema = z.object({
  customerId: z.string().uuid(),
  product: z.string(),
  amount: z.number(),
  price: z.number(),
  total: z.number(),
});

export type CreateOrderDTO = z.infer<typeof CreateOrderSchema>;
