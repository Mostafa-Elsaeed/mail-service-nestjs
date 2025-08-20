import { Injectable, Logger } from '@nestjs/common';
import { ClientProxy, ClientProxyFactory } from '@nestjs/microservices';
import { rabbitmqClientConfig } from './rabbit-mq-options';

@Injectable()
export class RabbitProducerService {
  private client: ClientProxy;
  private readonly logger = new Logger(RabbitProducerService.name);
  constructor() {
    this.client = ClientProxyFactory.create(rabbitmqClientConfig);
  }

  storeRequest(pattern: string, data: any) {
    this.client.emit(pattern, data);
    this.logger.log(`Request sent to RabbitMQ with pattern: ${pattern}`);
    // this.client.e
  }
}
