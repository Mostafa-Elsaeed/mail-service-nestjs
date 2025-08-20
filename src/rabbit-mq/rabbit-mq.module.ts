import { Module } from '@nestjs/common';
import { ClientsModule } from '@nestjs/microservices';

import { rabbitmqClientConfig } from './rabbit-mq-options';
import { RabbitProducerService } from './rabbit-producer.service';
import { RabbitConsumerService } from './rabbit-consumer.service';
import { ConfigModule } from '../config/config.module';

@Module({
  imports: [ConfigModule, ClientsModule.register([rabbitmqClientConfig])], // Wrap it in an array
  providers: [RabbitProducerService, RabbitConsumerService],
  exports: [RabbitProducerService, RabbitConsumerService],
})
export class RabbitMqModule {}
