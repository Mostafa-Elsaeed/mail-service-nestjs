import { MailAgentService } from 'src/mail-agent/mail-agent.service';
import { MailResultDto } from 'src/mail-agent/mail-respnse.dto';
import { SendMailDto } from 'src/mail/dto/send.dto';

export abstract class SimulationModesService {
  constructor(protected readonly mailAgent: MailAgentService) {}

  async sendMailUsingProvider(
    sendMailDto: SendMailDto,
    simulationInfo: MailResultDto,
  ): Promise<MailResultDto> {
    return this.mailAgent.sendMailUsingProvider(sendMailDto, simulationInfo);
  }

  abstract run(sendMailDto: SendMailDto): Promise<MailResultDto>;
}
