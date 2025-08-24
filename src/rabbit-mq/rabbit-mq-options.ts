import { Transport, ClientProviderOptions } from '@nestjs/microservices';
import { rabbitMqConfig } from '../config/sections/rabbit-mq/rabbit-mq.config';

const rabbitmqUrl = `amqp://${rabbitMqConfig().rabbitMq.rabbitMqUsername}:${rabbitMqConfig().rabbitMq.rabbitMqPassword}@${rabbitMqConfig().rabbitMq.rabbitMqHost}`;

export const rabbitmqClientConfig: ClientProviderOptions = {
  name: rabbitMqConfig().rabbitMq.serviceName || 'default_service',
  transport: Transport.RMQ,
  options: {
    urls: [rabbitmqUrl],
    queue: rabbitMqConfig().rabbitMq.rabbitMqQueueName,
    queueOptions: {
      durable: true,
    },
  },
};
