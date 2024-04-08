import { z } from 'zod';
import { createZodDto } from 'nestjs-zod';

export const newContactSchema = z.object({
  name: z.string().min(3),
  phone: z.string().min(10),
  email: z.string().email(),
});

export class NewContact extends createZodDto(newContactSchema) {}
