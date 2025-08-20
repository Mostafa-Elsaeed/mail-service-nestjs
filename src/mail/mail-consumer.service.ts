import {
  Injectable,
  Logger,
  OnModuleDestroy,
  OnModuleInit,
} from '@nestjs/common';
import { RabbitConsumerService } from 'src/rabbit-mq/rabbit-consumer.service';
import { MailService } from './mail.service';
import { MailRequestsEntity } from './entities/mail-requests.entity';
import { statusEnum } from './entities/status.enum';
import { plainToInstance } from 'class-transformer';
import { ConsumeMessage } from 'amqplib';

@Injectable()
export class MailConsumerService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(MailConsumerService.name);

  constructor(
    private readonly rabbitConsumerService: RabbitConsumerService,
    private mailService: MailService,
  ) {
    // this.rabbitConsumerService.handleMessage = this.handleMessage.bind(this);
  }

  async onModuleInit() {
    await this.rabbitConsumerService.connect();
    // this.rabbitConsumerService.consume();
    this.rabbitConsumerService.consume(this.handleMessage.bind(this));
  }

  /* eslint-disable @typescript-eslint/no-redundant-type-constituents */
  private async handleMessage(msg: ConsumeMessage | null): Promise<void> {
    if (!msg) return;
    let mailRequest: MailRequestsEntity | undefined;
    try {
      const content = this.extractContent(msg);
      if (!content) {
        this.logger.warn('❌ Could not extract content from message');
        this.rabbitConsumerService.ackMessage(msg);
        return;
      }

      const data = this.parseJson(content);
      if (!data) {
        this.logger.warn('❌ Invalid JSON message');
        this.rabbitConsumerService.ackMessage(msg);
        return;
      }

      mailRequest = this.shapeRequestToMailEntity(data);
      await this.processMailRequest(data);

      // ✅ Successfully processed → acknowledge
      this.rabbitConsumerService.ackMessage(msg);
    } catch (err) {
      this.logger.error('❌ Error processing message, requeuing...', err);

      // ❌ Any error → nack with requeue = true
      this.rabbitConsumerService.nackMessage(msg, true);
      if (mailRequest) {
        await this.mailService.changeMailRequestStatus(
          mailRequest,
          statusEnum.Queued,
        );
      }
    }
  }

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
    await this.rabbitConsumerService.onModuleDestroy();
    this.logger.log('RabbitMQ connection closed');
  }
}
