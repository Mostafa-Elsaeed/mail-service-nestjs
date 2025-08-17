// logging-simulation.service.ts
import { Injectable, Logger } from '@nestjs/common';
import { SimulationModesService } from '../simulation-modes.service';
import { MailAgentService } from 'src/mail-agent/mail-agent.service';
import { SendMailDto } from 'src/mail/dto/send.dto';
import { MailResultDto } from 'src/mail-agent/mail-respnse.dto';

@Injectable()
export class LoggingSimulationService extends SimulationModesService {
  private readonly logger = new Logger(LoggingSimulationService.name);

  constructor(mailAgent: MailAgentService) {
    super(mailAgent);
  }

  async run(sendMailDto: SendMailDto): Promise<MailResultDto> {
    this.logger.log(`📜 Logging email: ${JSON.stringify(sendMailDto)}`);

    // ⏳ Simulate delay (e.g. 2 seconds)
    const msDelay = 2000;
    await new Promise((resolve) => setTimeout(resolve, msDelay));

    const response: MailResultDto = {
      success: true,
      externalId: 'log-123',
      errorCode: undefined,
    };

    return response;
  }
}
