import { Injectable } from '@nestjs/common';
import { ConfigService } from 'src/config/config.service';
import { IMailAgent } from '../../mail-agent.interface';
import * as FormData from 'form-data';
import {
  Interfaces,
  MailgunClientOptions,
  MailgunMessageData,
  MessagesSendResult,
} from 'mailgun.js/definitions';
import { SendMailDto } from 'src/mail/dto/send.dto';

// Correct import for mailgun.js
import Mailgun from 'mailgun.js';

@Injectable()
export class MailGunService implements IMailAgent {
  constructor(private readonly config: ConfigService) {}

  getMailgunClient(): Interfaces.IMailgunClient {
    console.log('MailGUN KEY', this.config.mailProvider.mailgunApiKey);

    // Create a new Mailgun instance and then call client() on it
    const mailgun = new Mailgun(FormData);

    const clientOptions: MailgunClientOptions = {
      username: 'api',
      key: this.config.mailProvider.mailgunApiKey,
    };

    return mailgun.client(clientOptions);
  }

  async sendMail(originalData: SendMailDto) {
    // MAIL GUN DATA TYPE MailgunMessageData
    try {
      const mailgunClient = this.getMailgunClient();
      console.log('MAILGUN DOMAIN', this.config.mailProvider.mailgunDomain);
      const data = this.getImportantData(originalData);
      const result: MessagesSendResult = await mailgunClient.messages.create(
        this.config.mailProvider.mailgunDomain,
        data,
      );
      console.log('Mail sent successfully:', result);
    } catch (error) {
      console.error('Error sending mail:', error);
      throw new Error(`Failed to send mail: ${error.message}`);
    }
  }

  getImportantData(data: SendMailDto): MailgunMessageData {
    const mailData: MailgunMessageData = {
      to: data.recipients.map((e) => e.email),
      from: data.sender.email,
      html: data.html,
      subject: data.subject,
      cc: data.cc?.map((e) => e.email),
      bcc: data.bcc?.map((e) => e.email),
    };
    return mailData;
  }

  printOutProviderName() {
    console.log('Mail-GUN Mail Provider');
  }
}
