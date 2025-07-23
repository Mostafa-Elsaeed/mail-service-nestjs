export const mailProviderConfig = () => ({
  mailProvider: {
    mailgunApiKey: process.env.MAILGUN_API_KEY,
    mailgunSendKey: process.env.MAILGUN_SEND_KEY,
    mailgunWebhookKey: process.env.MAILGUN_WEBHOOK_KEY,
    mailgunDomain: process.env.MAILGUN_DOMAIN,

    graphTenantId: process.env.GRAPH_TENANT_ID,
    graphClientId: process.env.GRAPH_CLIENT_ID,
    graphClientSecret: process.env.GRAPH_CLIENT_SECRET,
    outlookDefaultSender: process.env.OUTLOOK_DEFAULT_SENDER,
  },
});
