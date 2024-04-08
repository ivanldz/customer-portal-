import { z } from 'zod';
import { createZodDto } from 'nestjs-zod';

export const ForgotPasswordSchema = z.object({
  email: z.string(),
});

export class ForgotPasswordDto extends createZodDto(ForgotPasswordSchema) {}
