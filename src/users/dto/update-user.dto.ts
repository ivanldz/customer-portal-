import { z } from 'zod';
import { createZodDto } from 'nestjs-zod';

export const UpdateUserSchema = z
  .object({
    roleId: z.number(),
  })
  .required();

export class UpdateUserDto extends createZodDto(UpdateUserSchema) {}
