import { Injectable, Logger } from '@nestjs/common';
import * as amqp from 'amqplib';
import { ConfigService } from 'src/config/config.service';
import { ConsumeMessage } from 'amqplib';

@Injectable()
export class RabbitConsumerService {
  private readonly logger = new Logger(RabbitConsumerService.name);
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

  //   async onModuleInit() {
  //     await this.connect();
  //     this.consume();
  //   }

  async connect() {
    try {
      this.connection = await amqp.connect(this.amqpUrl);
      this.channel = await this.connection.createChannel();
      await this.channel.assertQueue(this.queueName, { durable: this.durable });
      this.logger.log(
        `Connected to RabbitMQ Consumer queue: ${this.queueName}`,
      );
    } catch (err) {
      this.logger.error('Failed to connect to RabbitMQ Consumer', err);
    }
  }

  //   consume() {
  //     if (!this.channel) {
  //       throw new Error('RabbitMQ channel is not available.');
  //     }

  //     this.channel.consume(this.queueName, {
  //       noAck: false,
  //     });
  //   }

  /* eslint-disable @typescript-eslint/no-redundant-type-constituents */
  consume(handleMessage: (msg: ConsumeMessage | null) => Promise<void>) {
    if (!this.channel) {
      throw new Error('RabbitMQ channel is not available.');
    }

    this.channel.consume(
      this.queueName,
      async (msg) => {
        await handleMessage(msg);
      },
      { noAck: false },
    );
  }

  //   handleMessage(msg: ConsumeMessage | null): Promise<void> {
  //     // Implement message handling logic here
  //     return Promise.resolve(); // Placeholder; to be overridden in MailConsumerService.
  //   }

  async onModuleDestroy() {
    await this.channel?.close();
    await this.connection?.close();
    this.logger.log('RabbitMQ connection closed');
  }

  ackMessage(msg: ConsumeMessage): void {
    if (!this.channel) {
      throw new Error('RabbitMQ channel is not available.');
    }
    this.channel.ack(msg);
    this.logger.log(`Message acknowledged: ${msg.fields.deliveryTag}`);
  }

  nackMessage(msg: ConsumeMessage, requeue: boolean = true): void {
    if (!this.channel) {
      throw new Error('RabbitMQ channel is not available.');
    }
    this.channel.nack(msg, false, requeue);
    this.logger.log(
      `Message negatively acknowledged: ${msg.fields.deliveryTag}. Requeue: ${requeue}`,
    );
  }
}
