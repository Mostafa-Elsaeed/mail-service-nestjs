import { Injectable } from '@nestjs/common';

import { IMailAgent } from './mail-agent.interface';
import { OutlookService } from './providers/outlook.service';
import { SendMailDto } from 'src/mail/dto/send.dto';
import { MailGunService } from './providers/mail-gun.service';
@Injectable()
export class MailAgentService {
  constructor(
    private readonly mailGunService: MailGunService,
    private readonly outlookService: OutlookService,
  ) {}

  private getProviders(sendMailDto: SendMailDto): IMailAgent {
    return sendMailDto.batchId ||
      sendMailDto.templateId ||
      sendMailDto.messageLogId
      ? this.outlookService
      : this.mailGunService;
  }

  private async agentSendMail(mailAgent: IMailAgent, sendMailDto: SendMailDto) {
    mailAgent.printOutProviderName();
    return await mailAgent.sendMail(sendMailDto);
  }

  async sendMailUsingProvider(sendMailDto: SendMailDto) {
    const mailAgent = this.getProviders(sendMailDto);
    return await this.agentSendMail(mailAgent, sendMailDto);
  }
}
