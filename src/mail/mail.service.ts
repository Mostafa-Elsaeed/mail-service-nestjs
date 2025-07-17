import { Injectable } from '@nestjs/common';
import { SendMailDto } from './dto/send.dto';

@Injectable()
export class MailService {
  async sendMail(sendMailDto: SendMailDto) {}
}
