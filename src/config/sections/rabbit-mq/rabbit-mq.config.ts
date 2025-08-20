import { rabbitMqQueueEnum } from 'src/rabbit-mq/rabbit-queue.enum';

export const rabbitMqConfig = () => ({
  rabbitMq: {
    serviceName: process.env.RABBITMQ_SERVICE_NAME,

    rabbitMqHost: process.env.RABBITMQ_HOST,
    rabbitMqPort: process.env.RABBITMQ_PORT,

    rabbitMqUsername: process.env.RABBITMQ_USERNAME,
    rabbitMqPassword: process.env.RABBITMQ_PASSWORD,

    rabbitMqQueue: rabbitMqQueueEnum.MAIL_QUEUE,
  },
});
