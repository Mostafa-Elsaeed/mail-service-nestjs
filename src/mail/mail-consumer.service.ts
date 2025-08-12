import {
  Injectable,
  OnModuleInit,
  OnModuleDestroy,
  Logger,
} from '@nestjs/common';

import * as amqp from 'amqplib';
import { ConfigService } from 'src/config/config.service';

@Injectable()
export class MailConsumerService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(MailConsumerService.name);
  private connection: amqp.Connection;
  private channel: amqp.Channel;
  private readonly queueName: string;
  private readonly amqpUrl: string;
  private readonly durable: boolean;

  constructor(private readonly configService: ConfigService) {
    const username = this.configService.rabbitMq.rabbitMqUsername;
    const password = this.configService.rabbitMq.rabbitMqPassword;
    const host = this.configService.rabbitMq.rabbitMqHost;
    const port = this.configService.rabbitMq.rabbitMqPort;
    this.queueName = this.configService.rabbitMq.rabbitMqQueue;
    this.durable = true;
    this.amqpUrl = `amqp://${username}:${password}@${host}:${port}`;
  }

  async onModuleInit() {
    await this.connect();
    await this.consume();
  }

  private async connect() {
    try {
      this.connection = await amqp.connect(this.amqpUrl);
      this.channel = await this.connection.createChannel();
      await this.channel.assertQueue(this.queueName, { durable: this.durable });
      this.logger.log(`Connected to RabbitMQ queue: ${this.queueName}`);
    } catch (err) {
      this.logger.error('Failed to connect to RabbitMQ', err);
    }
  }

  private async consume() {
    if (!this.channel) {
      throw new Error('RabbitMQ channel is not available.');
    }

    this.channel.consume(
      this.queueName,
      (msg) => {
        if (msg) {
          const content = msg.content.toString();
          this.logger.log(`📩 Received message: ${content}`);

          try {
            const data = JSON.parse(content);
            this.logger.debug(`Parsed data: ${JSON.stringify(data)}`);
            // TODO: Handle email processing logic here
          } catch {
            this.logger.warn('Message is not valid JSON');
          }

          this.channel.ack(msg);
        }
      },
      { noAck: false },
    );
  }

  async onModuleDestroy() {
    await this.channel?.close();
    await this.connection?.close();
    this.logger.log('RabbitMQ connection closed');
  }
}
