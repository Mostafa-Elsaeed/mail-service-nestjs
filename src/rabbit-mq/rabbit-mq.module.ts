import { Module } from '@nestjs/common';
import { ClientsModule } from '@nestjs/microservices';

import { rabbitmqClientConfig } from './rabbit-mq-options';
import { RabbitMQService } from './rabbit-mq.service';
import { RabbitConsumerService } from './rabbit-consumer.service';
import { ConfigModule } from '../config/config.module';

@Module({
  imports: [ConfigModule, ClientsModule.register([rabbitmqClientConfig])], // Wrap it in an array
  providers: [RabbitMQService, RabbitConsumerService],
  exports: [RabbitMQService, RabbitConsumerService],
})
export class RabbitMqModule {}
