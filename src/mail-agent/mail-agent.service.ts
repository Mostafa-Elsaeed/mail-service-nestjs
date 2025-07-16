import { Injectable } from '@nestjs/common';
import { MailGunService } from './providers/mail-gun.service';
import { IMailAgent } from './mail-agent.interface';
import { OutlookService } from './providers/outlook.service';
@Injectable()
export class MailAgentService {
  constructor(
    private readonly mailGunService: MailGunService,
    private readonly outlookService: OutlookService,
  ) {}

  agentSendMail(mailAgent: IMailAgent, options: unknown) {
    mailAgent.sendMail(options);
  }

  testMailGun() {
    this.agentSendMail(this.outlookService, {});
  }
}
