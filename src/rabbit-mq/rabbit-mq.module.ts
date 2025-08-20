import { Module } from '@nestjs/common';
import { ClientsModule } from '@nestjs/microservices';

import { rabbitmqClientConfig } from './rabbit-mq-options';
import { RabbitMQService } from './rabbit-mq.service';

@Module({
  imports: [ClientsModule.register([rabbitmqClientConfig])], // Wrap it in an array
  providers: [RabbitMQService],
  exports: [RabbitMQService],
})
export class RabbitMqModule {}
