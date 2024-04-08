import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

export const CreatePermissionSchema = z.object({
  name: z.string(),
});

export class CreatePermission extends createZodDto(CreatePermissionSchema) {}
