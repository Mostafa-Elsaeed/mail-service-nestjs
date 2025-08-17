import { Inject, Injectable, Logger } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { plainToInstance } from 'class-transformer';

// Local imports
import { SendMailDto } from './dto/send.dto';

import { rabbitMqConfig } from '../config/sections/rabbit-mq/rabbit-mq.config';
import { MailRequestsEntity } from './entities/mail-requests.entity';
import { statusEnum } from './entities/status.enum';
import { SimulationService } from '../simulation/simulation.service';
import { MailResultDto } from 'src/mail-agent/mail-respnse.dto';

@Injectable()
export class MailService {
  private readonly logger = new Logger(MailService.name);
  constructor(
    @Inject(rabbitMqConfig().rabbitMq.serviceName)
    private rabbitmqClient: ClientProxy,

    @InjectRepository(MailRequestsEntity)
    private readonly mailRequestRepo: Repository<MailRequestsEntity>,

    private simulationService: SimulationService,
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

  async processMailRequest(sendMailDto: SendMailDto, requestId: string) {
    const mailRequest = await this.getOrFail(requestId);
    if (!mailRequest) return; // gracefully exit if not found

    await this.changeMailRequestStatus(mailRequest, statusEnum.PROCESSING);
    try {
      const sendResponse =
        await this.simulationService.runSimulation(sendMailDto);

      await this.changeMailRequestStatus(
        mailRequest,
        sendResponse.success ? statusEnum.DONE : statusEnum.ERROR,
      );
    } catch (error) {
      this.logger.error(`Error during mail simulation: ${error.message}`);
      await this.changeMailRequestStatus(mailRequest, statusEnum.ERROR);
    }
  }

  updateMailRequestDB(
    mailRequest: MailRequestsEntity,
    requestResult: MailResultDto,
  ) {
    mailRequest.externalId = requestResult.externalId;
    mailRequest.errorCode = requestResult.errorCode;
    mailRequest.status = requestResult.success
      ? statusEnum.DONE
      : statusEnum.ERROR;
    return this.mailRequestRepo.save(mailRequest);
  }

  // DB FUNCTIONS
  async getMailRequestById(mailRequestId: string) {
    return await this.mailRequestRepo.findOne({
      where: { id: mailRequestId },
    });
  }
  async getOrFail(mailRequestId: string) {
    const mailRequest = await this.getMailRequestById(mailRequestId);
    if (!mailRequest) {
      this.logger.warn(`Mail request ${mailRequestId} not found`);
      return null; // or throw, depending on use case
    }
    return mailRequest;
  }
  async changeMailRequestStatus(
    mailRequest: MailRequestsEntity,
    status: statusEnum,
  ) {
    mailRequest.status = status;
    return this.mailRequestRepo.save(mailRequest);
  }
  updateMailRequestRetryCount(
    mailRequest: MailRequestsEntity,
    retryCount: number,
  ) {
    mailRequest.retryCount = retryCount + 1;
    return this.mailRequestRepo.save(mailRequest);
  }

  updateMailRequestExternalId(
    mailRequest: MailRequestsEntity,
    externalId: string,
  ) {
    mailRequest.externalId = externalId;
    return this.mailRequestRepo.save(mailRequest);
  }

  updateMailRequestErrorCode(
    mailRequest: MailRequestsEntity,
    errorCode: string,
  ) {
    mailRequest.errorCode = errorCode;
    return this.mailRequestRepo.save(mailRequest);
  }
}
