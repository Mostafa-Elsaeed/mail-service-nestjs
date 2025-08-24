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
    // this.rabbitConsumerService.handleMessage = this.processMessage.bind(this);
  }

  async onModuleInit() {
    await this.rabbitConsumerService.connect();
    // this.rabbitConsumerService.consume();
    this.rabbitConsumerService.consume(this.processMessage.bind(this));
  }

  /* eslint-disable @typescript-eslint/no-redundant-type-constituents */
  private async processMessage(msg: ConsumeMessage | null): Promise<void> {
    if (!msg) return;
    let mailRequest: MailRequestsEntity | undefined = undefined;
    try {
      const content = this.extractContent(msg);
      if (!content) return this.acknowledgeMessage(msg);

      const data = this.parseJson(content);
      if (!data) return this.acknowledgeMessage(msg);

      const tempMailRequest = this.shapeRequestToMailEntity(data);
      if (!tempMailRequest) return this.acknowledgeMessage(msg); // Early exit if shaping fails
      mailRequest = tempMailRequest;

      await this.processMailRequest(mailRequest); // Pass the type-safe mailRequest

      // ✅ Successfully processed → acknowledge
      this.acknowledgeMessage(msg);
    } catch (err) {
      await this.handleError(err, msg, mailRequest);
    }
  }

  private async handleError(
    err: Error,
    msg: ConsumeMessage,
    mailRequest: MailRequestsEntity | undefined,
  ): Promise<void> {
    if (!mailRequest) {
      this.acknowledgeMessage(msg);
      return;
    }
    this.logger.error('❌ Error processing message, requeuing...', err);
    await this.mailService.updateFailedMailRequest(mailRequest, err.message);
    this.nackMessage(msg, true);
    await this.mailService.changeMailRequestStatus(
      mailRequest,
      statusEnum.Queued,
    );
  }

  private extractContent(msg: ConsumeMessage): string | null {
    try {
      const data = msg.content.toString();
      this.logger.log(`📩 Received message: ${data}`);
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

  private async processMailRequest(
    mailRequest: MailRequestsEntity,
  ): Promise<void> {
    await this.mailService.handleNewMailRequest(mailRequest);
  }

  shapeRequestToMailEntity(data: any): MailRequestsEntity | undefined {
    if (!data?.data) {
      this.logger.warn('⚠️ Message missing "data" property');
      return undefined; // Return undefined for better type safety
    }
    return plainToInstance(MailRequestsEntity, data.data);
  }

  private acknowledgeMessage(msg: ConsumeMessage): void {
    this.rabbitConsumerService.ackMessage(msg);
    //  this.rabbitConsumerService.nackMessage
  }
  private nackMessage(msg: ConsumeMessage, requeue = true): void {
    this.rabbitConsumerService.nackMessage(msg, requeue);
  }

  async onModuleDestroy() {
    await this.rabbitConsumerService.onModuleDestroy();
    this.logger.log('RabbitMQ connection closed');
  }
}
