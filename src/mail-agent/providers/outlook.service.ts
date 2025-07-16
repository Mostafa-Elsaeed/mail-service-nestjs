import { Injectable } from '@nestjs/common';
import { IMailAgent } from '../mail-agent.interface';
@Injectable()
export class OutlookService implements IMailAgent {
  sendMail(options: unknown) {
    console.log('Sending mail with Outlook:', options);
  }
}
