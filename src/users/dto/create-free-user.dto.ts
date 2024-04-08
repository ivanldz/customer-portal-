import { z } from 'zod';

export const createFreeUserSchema = z
  .object({
    email: z.string({
      required_error: 'username is required',
      invalid_type_error: 'username must be a string',
    }),
    clientId: z.string(),
    password: z.string(),
  })
  .required();

export type CreateFreeUserDto = z.infer<typeof createFreeUserSchema>;
