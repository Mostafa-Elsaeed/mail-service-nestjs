import { z } from 'zod';

export const rabbitMqSchema = z.object({
  RABBITMQ_SERVICE_NAME: z.string(),
  RABBITMQ_HOST: z.string(),
  RABBITMQ_PORT: z.string(),
  RABBITMQ_USERNAME: z.string(),
  RABBITMQ_PASSWORD: z.string(),
  // RABBITMQ_QUEUE: z.string(),
});
