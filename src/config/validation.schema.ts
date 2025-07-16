import { appSchema } from './sections/app/app.schema';
import { databaseSchema } from './sections/database/database.schema';
import { z } from 'zod';

export const envSchema = z.object({
  ...appSchema.shape,
  ...databaseSchema.shape,
});
