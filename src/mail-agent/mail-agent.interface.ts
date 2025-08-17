import { MailResultDto } from './mail-respnse.dto';

export interface IMailAgent {
  sendMail(options: unknown): Promise<MailResultDto>;
  printOutProviderName(): void;
  convertMailResultToUnifiedResponse(responseShape: unknown): MailResultDto;
}
