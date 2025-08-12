import { Body, Controller, Post } from '@nestjs/common';
import { MailService } from './mail.service';
import { SendMailDto } from './dto/send.dto';
// import { rabbitMqQueueEnum } from 'src/rabbit-mq/rabbit-queue.enum';
// import { EventPattern, Payload } from '@nestjs/microservices';

@Controller('mail')
export class MailController {
  constructor(private readonly mailService: MailService) {}

  @Post('send')
  sendMail(@Body() sendMailDto: SendMailDto) {
    return this.mailService.sendMail(sendMailDto);
  }

  // @EventPattern(rabbitMqQueueEnum.MAIL_QUEUE)
  // handleMailQueue(@Payload() data: any) {
  //   console.log('📩 Received message from mail_queue:', data);
  //   // handle message...
  // }
}
