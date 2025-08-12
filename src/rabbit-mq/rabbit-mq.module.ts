import { Global, Module } from '@nestjs/common';
import { ClientsModule } from '@nestjs/microservices';
import { rabbitmqClientConfig } from './rabbit-mq-options';

@Global()
@Module({
  imports: [ClientsModule.register([rabbitmqClientConfig])],
  exports: [ClientsModule],
})
export class RabbitMqModule {}
