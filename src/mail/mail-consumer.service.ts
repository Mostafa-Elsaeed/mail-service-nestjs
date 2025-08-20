import {
  Injectable,
  OnModuleInit,
  OnModuleDestroy,
  Logger,
} from '@nestjs/common';

import * as amqp from 'amqplib';
import { ConfigService } from 'src/config/config.service';
import { MailRequestsEntity } from './entities/mail-requests.entity';

import { plainToInstance } from 'class-transformer';
import { MailService } from './mail.service';
import { ConsumeMessage } from 'amqplib';
import { statusEnum } from './entities/status.enum';

@Injectable()
export class MailConsumerService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(MailConsumerService.name);
  private connection: amqp.Connection;
  private channel: amqp.Channel;
  private readonly queueName: string;
  private readonly amqpUrl: string;
  private readonly durable: boolean;

  constructor(
    private readonly configService: ConfigService,
    private mailService: MailService,
  ) {
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
    this.consume();
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

  private consume() {
    if (!this.channel) {
      throw new Error('RabbitMQ channel is not available.');
    }

    // Bind to keep `this` context
    this.channel.consume(this.queueName, this.handleMessage.bind(this), {
      noAck: false,
    });
  }

  /* eslint-disable @typescript-eslint/no-redundant-type-constituents */

  private async handleMessage(msg: ConsumeMessage | null): Promise<void> {
    if (!msg) return;
    let mailRequest: MailRequestsEntity | undefined;
    try {
      const content = this.extractContent(msg);
      if (!content) {
        this.logger.warn('❌ Could not extract content from message');
        this.channel.ack(msg);
        return;
      }

      const data = this.parseJson(content);
      if (!data) {
        this.logger.warn('❌ Invalid JSON message');
        this.channel.ack(msg);
        return;
      }
      mailRequest = this.shapeRequestToMailEntity(data);
      await this.processMailRequest(data);

      // ✅ Successfully processed → acknowledge
      this.channel.ack(msg);
    } catch (err) {
      this.logger.error('❌ Error processing message, requeuing...', err);

      // ❌ Any error → nack with requeue = true
      this.channel.nack(msg, false, true);
      if (mailRequest) {
        await this.mailService.changeMailRequestStatus(
          mailRequest,
          statusEnum.Queued,
        );
      }
    }
  }

  // ----- smaller duties -----

  private extractContent(msg: ConsumeMessage): string | null {
    try {
      const data = msg.content.toString();
      console.log(`📩 Received message: ${data}`);
      return data;
    } catch (err) {
      this.logger.error('Failed to extract content from message', err);
      return null;
    }
  }

  private parseJson(content: string): unknown | null {
    try {
      const parsed = JSON.parse(content);
      this.logger.debug(`Parsed data: ${JSON.stringify(parsed)}`);
      return parsed;
    } catch (err) {
      this.logger.warn('Failed to parse JSON', err);
      return null;
    }
  }

  private async processMailRequest(data: any): Promise<void> {
    if (!data?.data) {
      this.logger.warn('⚠️ Message missing "data" property');
      return;
    }

    const mailRequest = plainToInstance(MailRequestsEntity, data.data);
    await this.mailService.handleNewMailRequest(mailRequest);
  }

  shapeRequestToMailEntity(data: any) {
    if (!data?.data) {
      this.logger.warn('⚠️ Message missing "data" property');
      return;
    }
    return plainToInstance(MailRequestsEntity, data.data);
  }

  async onModuleDestroy() {
    await this.channel?.close();
    await this.connection?.close();
    this.logger.log('RabbitMQ connection closed');
  }
}
