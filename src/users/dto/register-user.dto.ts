import { z } from 'zod';
import { createZodDto } from 'nestjs-zod';

export const registerUserShema = z
  .object({
    password: z.string(),
    email: z.string({
      required_error: 'username is required',
      invalid_type_error: 'username must be a string',
    }),
    clientId: z.string(),
  })
  .required();

export class RegisterUserDto extends createZodDto(registerUserShema) {}
