import { Injectable } from '@nestjs/common';
import { SendMailDto } from './dto/send.dto';
import { MailAgentService } from 'src/mail-agent/mail-agent.service';

@Injectable()
export class MailService {
  constructor(private mailAgentService: MailAgentService) {}
  async sendMail(sendMailDto: SendMailDto) {
    return await this.mailAgentService.sendMailUsingProvider(sendMailDto);
  }
}
