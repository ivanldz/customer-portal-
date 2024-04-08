import { z } from 'zod';

export const SendClaimSchema = z.object({
  subject: z.string(),
  body: z.string().max(1000),
});

export type SendClaim = z.infer<typeof SendClaimSchema>;
