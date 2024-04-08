import { z } from 'zod';
import {
  AccessNumbers,
  Consultant,
  PropertyType,
  SurveillanceType,
  UnitNumbers,
} from '../anums/budgets.enum';
import { createZodDto } from 'nestjs-zod';

export const newBudgetSchema = z.object({
  name: z.string(),
  phone: z.string(),
  email: z.string(),
  propertyType: z.nativeEnum(PropertyType),
  unitNumbers: z.nativeEnum(UnitNumbers),
  accessNumber: z.nativeEnum(AccessNumbers),
  surveillanceType: z.nativeEnum(SurveillanceType),
  location: z.string(),
  consultant: z.nativeEnum(Consultant),
});

export class NewBudget extends createZodDto(newBudgetSchema) {}
