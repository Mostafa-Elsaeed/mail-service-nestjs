import { Injectable } from '@nestjs/common';
import { ConfigService } from 'src/config/config.service';

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
import { IMailAgent } from '../mail-agent.interface';
import { MailResultDto } from '../mail-respnse.dto';

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

  async sendMail(originalData: SendMailDto): Promise<MailResultDto> {
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
      return this.convertMailResultToUnifiedResponse(result);
    } catch (error) {
      console.error('Error sending mail:', error);
      const failureResult: MessagesSendResult = {
        status: 500,
        message: 'Failed to send email',
        details: 'SMTP connection timeout',
      };
      // result.;
      return this.convertMailResultToUnifiedResponse(failureResult);
      // throw new Error(`Failed to send mail: ${error.message}`);
    }
  }

  convertMailResultToUnifiedResponse(
    mailResult: MessagesSendResult,
  ): MailResultDto {
    const unifiedResponse: MailResultDto = {
      externalId: mailResult.id,
      success: mailResult.id ? true : false,
    };
    return unifiedResponse;
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
