import { z } from 'zod';
import { createZodDto } from 'nestjs-zod';

export const CreateRoleSchema = z.object({
  name: z.string(),
  permissionsId: z.array(z.number()),
});

export class CreateRole extends createZodDto(CreateRoleSchema) {}
