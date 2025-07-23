import { z } from 'zod';

export const mailProviderSchema = z.object({
  MAILGUN_API_KEY: z.string(),
  MAILGUN_SEND_KEY: z.string(),
  MAILGUN_WEBHOOK_KEY: z.string(),
  MAILGUN_DOMAIN: z.string(),

  GRAPH_TENANT_ID: z.string(),
  GRAPH_CLIENT_ID: z.string(),
  GRAPH_CLIENT_SECRET: z.string(),
  OUTLOOK_DEFAULT_SENDER: z.string(),
});
