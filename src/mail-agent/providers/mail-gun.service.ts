import { Injectable } from '@nestjs/common';
import { IMailAgent } from '../mail-agent.interface';
// import Mailgun from 'mailgun.js';
@Injectable()
export class MailGunService implements IMailAgent {
  // constructor(private readonly config: ConfigService) {}
  sendMail(options: unknown) {
    console.log('Sending mail with MailGun:', options);
  }
  // private MAILGUN_KEY = '';
  // private MAILGUN_DOMAIN = '';
  // private client = new Mailgun(FormData).client({
  //   username: 'api',
  //   key: this.MAILGUN_KEY,
  // });
  // async sendMail(data) {
  //   this.client.messages
  //     .create(this.MAILGUN_DOMAIN, data)
  //     .then((res) => {
  //       console.log(res);
  //     })
  //     .catch((err) => {
  //       console.error(err);
  //     });
  // }
}
