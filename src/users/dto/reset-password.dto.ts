import { z } from 'zod';
import { createZodDto } from 'nestjs-zod';

export const ResetPasswordSchema = z
  .object({
    password: z.string(),
    repeatePassword: z.string(),
  })
  .required();

export class ResetPasswordDto extends createZodDto(ResetPasswordSchema) {}
