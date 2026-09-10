import { z } from 'zod';

export const createExampleSchema = z.object({
  name: z.string().trim().min(1, 'El nombre es requerido').max(120),
});

export const idParamSchema = z.object({
  id: z.string().min(1),
});
