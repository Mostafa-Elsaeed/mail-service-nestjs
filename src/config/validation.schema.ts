import { z } from 'zod';
import { appSchema } from './sections/app/app.schema';
import { databaseSchema } from './sections/database/database.schema';
import { mailProviderSchema } from './sections/mail-providors/mail-provider.schema';
import { rabbitMqSchema } from './sections/rabbit-mq/rabbit-mq.schema';

export const envSchema = z.object({
  ...appSchema.shape,
  ...databaseSchema.shape,
  ...mailProviderSchema.shape,
  ...rabbitMqSchema.shape,
});
