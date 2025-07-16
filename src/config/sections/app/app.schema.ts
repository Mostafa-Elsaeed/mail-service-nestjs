import { z } from 'zod';
import { NodeEnvEnum } from './node-env.enum';

export const appSchema = z.object({
  // App config
  NODE_ENV: z.enum(NodeEnvEnum),
  PORT: z.coerce.number().default(3000),
});
