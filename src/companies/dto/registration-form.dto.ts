import { z } from 'zod';

export const RegistrationFormSchema = z.object({
  firstName: z.string(),
  lastName: z.string(),
  email: z.string().email(),
  dni: z.string(),
  companyName: z.string(),
  taxCondition: z.string(),
  acceptTermsAndConditions: z.string(),
  receiveUpdatesByEmail: z.string(),
  serviceType: z.string(),
  password: z.string(),
  repeatPassword: z.string(),
});

export type RegistrationForm = z.infer<typeof RegistrationFormSchema>;
