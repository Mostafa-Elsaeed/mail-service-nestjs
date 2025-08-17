// import { MailAgentService } from 'src/mail-agent/mail-agent.service';
// import { SendMailDto } from 'src/mail/dto/send.dto';

import { MailAgentService } from 'src/mail-agent/mail-agent.service';
import { SendMailDto } from 'src/mail/dto/send.dto';

// export interface ISimulation {
//   run(sendMailDto: SendMailDto);
// }

// simulation-modes.service.ts

export abstract class SimulationModesService {
  constructor(protected readonly mailAgent: MailAgentService) {}

  async sendMailUsingProvider(sendMailDto: SendMailDto) {
    return this.mailAgent.sendMailUsingProvider(sendMailDto);
  }

  abstract run(sendMailDto: SendMailDto);
}
