import { z } from 'zod';
import { createZodDto } from 'nestjs-zod';

export const createUsertSchema = z
  .object({
    email: z.string({
      required_error: 'username is required',
      invalid_type_error: 'username must be a string',
    }),
    roleId: z.number(),
  })
  .required();

export class CreateUserDto extends createZodDto(createUsertSchema) {}
