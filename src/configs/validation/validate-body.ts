import { BadRequestException } from '../../exceptions';
import { ZodSchema } from 'zod';

export function validateBody<T>(schema: ZodSchema<T>, body: unknown): T {
  const result = schema.safeParse(body);

  if (!result.success) {
    throw new BadRequestException('Invalid Params', {
      params: result.error.errors.map((e) => e.path.join('.')),
    });
  }

  return result.data;
}
