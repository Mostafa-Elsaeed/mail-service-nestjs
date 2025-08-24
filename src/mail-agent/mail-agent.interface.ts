import { MailResultDto } from './mail-respnse.dto';

export interface IMailAgent {
  sendMail(
    options: unknown,
    simulationInfo: MailResultDto,
  ): Promise<MailResultDto>;

  convertMailResultToUnifiedResponse(
    responseShape: unknown,
    simulationInfo: MailResultDto,
  ): MailResultDto;

  printOutProviderName(): void;
}
