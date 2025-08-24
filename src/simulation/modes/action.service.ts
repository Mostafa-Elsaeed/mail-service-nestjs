// action-simulation.service.ts
import { Injectable, Logger } from '@nestjs/common';
import { SimulationModesService } from '../simulation-modes.service';
import { MailAgentService } from 'src/mail-agent/mail-agent.service';
import { SendMailDto } from 'src/mail/dto/send.dto';
import { MailResultDto } from 'src/mail-agent/mail-respnse.dto';

@Injectable()
export class ActionSimulationService extends SimulationModesService {
  private readonly logger = new Logger(ActionSimulationService.name);
  constructor(mailAgent: MailAgentService) {
    super(mailAgent);
  }

  async run(sendMailDto: SendMailDto): Promise<MailResultDto> {
    // real send
    const simulationInfo = new MailResultDto();
    simulationInfo.realRecipients = sendMailDto.recipients.map((r) => r.email);
    return await this.sendMailUsingProvider(sendMailDto, simulationInfo);
  }
}
