// action-simulation.service.ts
import { Injectable, Logger } from '@nestjs/common';
import { SimulationModesService } from '../simulation-modes.service';
import { MailAgentService } from 'src/mail-agent/mail-agent.service';
import { SendMailDto } from 'src/mail/dto/send.dto';

@Injectable()
export class ActionSimulationService extends SimulationModesService {
  private readonly logger = new Logger(ActionSimulationService.name);
  constructor(mailAgent: MailAgentService) {
    super(mailAgent);
  }

  async run(sendMailDto: SendMailDto) {
    // real send

    await this.sendMailUsingProvider(sendMailDto);
  }
}
