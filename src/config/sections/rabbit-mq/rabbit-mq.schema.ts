import { z } from 'zod';
// import { defaultQueueName } from './rabbit-mq-queueName';
const defaultQueueName = 'mail_queue';

export const rabbitMqSchema = z.object({
  RABBITMQ_SERVICE_NAME: z.string(),
  RABBITMQ_HOST: z.string(),
  RABBITMQ_PORT: z.string(),
  RABBITMQ_USERNAME: z.string(),
  RABBITMQ_PASSWORD: z.string(),
  RABBITMQ_QUEUE_NAME: z.string().default(defaultQueueName),
});
