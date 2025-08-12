import { Inject, Injectable } from '@nestjs/common';
import { SendMailDto } from './dto/send.dto';
import { MailAgentService } from 'src/mail-agent/mail-agent.service';
import { RabbitMQService } from 'src/rabbit-mq/rabbit-mq.service';
// import { rabbitMqQueueEnum } from 'src/rabbit-mq/rabbit-queue.enum';
import { ClientProxy } from '@nestjs/microservices';
import { rabbitMqConfig } from 'src/config/sections/rabbit-mq/rabbit-mq.config';

@Injectable()
export class MailService {
  constructor(
    @Inject(rabbitMqConfig().rabbitMq.serviceName)
    private rabbitmqClient: ClientProxy,
    private mailAgentService: MailAgentService,
    // private rabbitMqService: RabbitMQService,
  ) {}

  sendMail(sendMailDto: SendMailDto) {
    // return this.rabbitMqService.storeRequest('another_mail_queue', sendMailDto);
    this.rabbitmqClient.emit('another_mail_queue', sendMailDto);
    console.log(
      `📩 Mail sent to RabbitMQ With Pattern:${rabbitMqConfig().rabbitMq.rabbitMqQueue}`,
    );
    // return await this.mailAgentService.sendMailUsingProvider(sendMailDto);
  }
}
