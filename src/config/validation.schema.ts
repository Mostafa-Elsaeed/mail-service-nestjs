import { appSchema } from './sections/app/app.schema';
import { databaseSchema } from './sections/database/database.schema';
import { z } from 'zod';
import { mailProviderSchema } from './sections/mail-providors/mail-provider.schema';

export const envSchema = z.object({
  ...appSchema.shape,
  ...databaseSchema.shape,
  ...mailProviderSchema.shape,
});
