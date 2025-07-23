export interface IMailProviderConfig {
  mailgunApiKey: string;
  mailgunSendKey: string;
  mailgunWebhookKey: string;
  mailgunDomain: string;

  graphTenantId: string;
  graphClientId: string;
  graphClientSecret: string;
  outlookDefaultSender: string;
}
