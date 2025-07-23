import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '../../config/config.service';
import { IMailAgent } from '../mail-agent.interface';
import { Client } from '@microsoft/microsoft-graph-client';
import axios from 'axios';

export interface OutlookMailOptions {
  to: string | string[];
  subject: string;
  body: string;
  isHtml?: boolean;
  cc?: string | string[];
  bcc?: string | string[];
  from?: string;
  attachments?: Array<{
    name: string;
    content: Buffer | string;
    contentType: string;
  }>;
}

@Injectable()
export class OutlookService implements IMailAgent {
  private readonly logger = new Logger(OutlookService.name);
  private graphClient: Client;
  private accessToken: string;
  private tokenExpiry: Date;

  constructor(private configService: ConfigService) {
    // Initialize the Graph client with authentication callback
    this.graphClient = Client.init({
      authProvider: async (done) => {
        try {
          // Get a valid token
          const token = await this.getAccessToken();
          done(null, token);
        } catch (error) {
          this.logger.error(
            `Auth provider error: ${error.message}`,
            error.stack,
          );
          done(error, null);
        }
      },
      defaultVersion: 'v1.0',
    });
  }

  private async getAccessToken(): Promise<string> {
    // Check if we have a valid token
    if (this.accessToken && this.tokenExpiry && this.tokenExpiry > new Date()) {
      return this.accessToken;
    }

    try {
      const tenantId = this.configService.mailProvider.graphTenantId;
      const clientId = this.configService.mailProvider.graphClientId;
      const clientSecret = this.configService.mailProvider.graphClientSecret;

      const tokenEndpoint = `https://login.microsoftonline.com/${tenantId}/oauth2/v2.0/token`;

      const response = await axios.post(
        tokenEndpoint,
        new URLSearchParams({
          client_id: clientId,
          scope: 'https://graph.microsoft.com/.default',
          client_secret: clientSecret,
          grant_type: 'client_credentials',
        }),
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
        },
      );

      this.accessToken = response.data.access_token;

      // Set token expiry (subtract 5 minutes to be safe)
      const expiresInSeconds = response.data.expires_in || 3600;
      this.tokenExpiry = new Date();
      this.tokenExpiry.setSeconds(
        this.tokenExpiry.getSeconds() + expiresInSeconds - 300,
      );

      return this.accessToken;
    } catch (error) {
      this.logger.error(
        `Failed to obtain Microsoft Graph access token: ${error.message}`,
        error.stack,
      );
      throw new Error('Failed to obtain Microsoft Graph access token');
    }
  }

  async sendMail(options: OutlookMailOptions) {
    try {
      // Format recipients
      const toRecipients = this.formatRecipients(options.to);
      const ccRecipients = options.cc ? this.formatRecipients(options.cc) : [];
      const bccRecipients = options.bcc
        ? this.formatRecipients(options.bcc)
        : [];

      // Create email message
      const message = {
        message: {
          subject: options.subject,
          body: {
            contentType: options.isHtml ? 'HTML' : 'Text',
            content: options.body,
          },
          toRecipients,
          ccRecipients: ccRecipients.length > 0 ? ccRecipients : undefined,
          bccRecipients: bccRecipients.length > 0 ? bccRecipients : undefined,
          attachments: [{}],
        },
        saveToSentItems: true,
      };

      // If there are attachments, add them
      if (options.attachments && options.attachments.length > 0) {
        message.message.attachments = options.attachments.map((attachment) => ({
          '@odata.type': '#microsoft.graph.fileAttachment',
          name: attachment.name,
          contentType: attachment.contentType,
          contentBytes:
            typeof attachment.content === 'string'
              ? Buffer.from(attachment.content).toString('base64')
              : attachment.content.toString('base64'),
        }));
      }

      // Send the email using application permissions (app-only)
      // When using application permissions, we send from a specific user
      const userEmail =
        options.from || this.configService.mailProvider.outlookDefaultSender;

      if (!userEmail) {
        throw new Error('Sender email address is required but not provided');
      }

      this.logger.debug(
        `Sending email to ${JSON.stringify(options.to)} from ${userEmail}`,
      );

      await this.graphClient.api(`/users/${userEmail}/sendMail`).post(message);

      this.logger.log(
        `Email sent successfully to ${JSON.stringify(options.to)}`,
      );

      return {
        success: true,
        message: 'Email sent successfully',
      };
    } catch (error) {
      this.logger.error(
        `Error sending email with Outlook: ${error.message}`,
        error.stack,
      );
      return {
        success: false,
        message: `Failed to send email: ${error.message}`,
        error,
      };
    }
  }

  private formatRecipients(recipients: string | string[]) {
    const recipientsList = Array.isArray(recipients)
      ? recipients
      : [recipients];
    return recipientsList.map((email) => ({
      emailAddress: {
        address: email,
      },
    }));
  }

  printOutProviderName() {
    console.log('Outlook Mail Provider');
  }
}
