import { z } from 'zod';
import { NodeEnvEnum } from './node-env.enum';

export const appSchema = z.object({
  // App config
  NODE_ENV: z.enum(NodeEnvEnum),
  PORT: z.coerce.number().default(3000),
  DEV_EMAIL: z.string().email(),
  RETRY_ATTEMPTS: z.coerce.number().default(5),
});
