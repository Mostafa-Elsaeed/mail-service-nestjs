import { z } from 'zod';

export const databaseSchema = z.object({
  // Database config
  DATABASE_HOST: z.string(),
  DATABASE_PORT: z.coerce.number(),
  DATABASE_USERNAME: z.string(),
  DATABASE_PASSWORD: z.string(),
  DATABASE_NAME: z.string(),
  DATABASE_SCHEMA: z.string().optional(),
});
