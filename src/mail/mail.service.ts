import { Inject, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { plainToInstance } from 'class-transformer';

// Local imports
import { SendMailDto } from './dto/send.dto';
import { MailAgentService } from '../mail-agent/mail-agent.service';
import { rabbitMqConfig } from '../config/sections/rabbit-mq/rabbit-mq.config';
import { MailRequestsEntity } from './entities/mail-requests.entity';
import { statusEnum } from './entities/status.enum';

@Injectable()
export class MailService {
  private readonly logger = new Logger(MailService.name);
  constructor(
    @Inject(rabbitMqConfig().rabbitMq.serviceName)
    private rabbitmqClient: ClientProxy,
    private mailAgentService: MailAgentService,
    @InjectRepository(MailRequestsEntity)
    private readonly mailRequestRepo: Repository<MailRequestsEntity>,
  ) {}

  async sendMail(sendMailDto: SendMailDto) {
    const mailRequest = await this.saveNewMailRequest(sendMailDto);

    this.rabbitmqClient.emit('another_mail_queue', mailRequest);
    console.log(`📩 Mail sent to RabbitMQ`);
  }

  async handleNewMailRequest(mailRequestRecord: MailRequestsEntity) {
    // Save the request to the database

    const payload = mailRequestRecord.payload;
    const mailRequestId = mailRequestRecord.id;
    const mailPayload = plainToInstance(SendMailDto, payload);
    await this.processMailRequest(mailPayload, mailRequestId);
  }

  async saveNewMailRequest(sendMailDto: SendMailDto) {
    const request = this.mailRequestRepo.create({ payload: sendMailDto });
    return this.mailRequestRepo.save(request);
  }

  async changeMailRequestStatus(
    mailRequest: MailRequestsEntity,
    status: statusEnum,
  ) {
    mailRequest.status = status;
    return this.mailRequestRepo.save(mailRequest);
  }

  async getMailRequestById(mailRequestId: string) {
    const mailRequest = await this.mailRequestRepo.findOne({
      where: { id: mailRequestId },
    });
    if (!mailRequest) {
      this.logger.warn(`Mail request ${mailRequestId} not found`);
      // throw new NotFoundException(
      //   `Mail request with ID ${mailRequestId} not found`,
      // );
    }
    return mailRequest;
  }

  async getOrFail(mailRequestId: string) {
    const mailRequest = await this.getMailRequestById(mailRequestId);
    if (!mailRequest) {
      this.logger.warn(`Mail request ${mailRequestId} not found`);
      return null; // or throw, depending on use case
    }
    return mailRequest;
  }

  async processMailRequest(sendMailDto: SendMailDto, requestId: string) {
    const mailRequest = await this.getOrFail(requestId);
    if (!mailRequest) return; // gracefully exit if not found

    await this.changeMailRequestStatus(mailRequest, statusEnum.PROCESSING);

    await this.mailAgentService.sendMailUsingProvider(sendMailDto);

    // await this.changeMailRequestStatus(mailRequest, statusEnum.DONE);
  }
}
