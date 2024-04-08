import { z } from 'zod';
import { createZodDto } from 'nestjs-zod';

export const CreateCompanySchema = z.object({
  clientId: z.string(),
  name: z.string(),
});

export class CreateCompany extends createZodDto(CreateCompanySchema) {}
