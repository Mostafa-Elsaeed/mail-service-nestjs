// dev-simulation.service.ts
import { Injectable, Logger } from '@nestjs/common';
import { SimulationModesService } from '../simulation-modes.service';
import { MailAgentService } from 'src/mail-agent/mail-agent.service';
import { SendMailDto } from 'src/mail/dto/send.dto';
import { ConfigService } from '../../config/config.service';
import { MailResultDto } from 'src/mail-agent/mail-respnse.dto';

@Injectable()
export class DevSimulationService extends SimulationModesService {
  private readonly logger = new Logger(DevSimulationService.name);

  constructor(
    mailAgent: MailAgentService,
    private configService: ConfigService,
  ) {
    super(mailAgent);
  }

  async run(sendMailDto: SendMailDto): Promise<MailResultDto> {
    this.logger.log(
      `🛠 Dev mode, skipping real send: ${JSON.stringify(sendMailDto)}`,
    );
    const devEmail = this.configService.app.devEmail;
    const simulationInfo = new MailResultDto();
    if (devEmail) {
      simulationInfo.realRecipients = [devEmail];
      this.logger.log(`📧 Dev email: ${devEmail}`);
      sendMailDto.recipients.map((e) => {
        e.email = devEmail;
      });
      return await this.sendMailUsingProvider(sendMailDto, simulationInfo);
    } else {
      this.logger.warn('⚠️ No dev email configured, skipping send.');
      // const error: MailResultDto = {
      //   errorCode: '404',
      //   success: false,
      //   externalId: undefined,
      //   // message: 'Dev email not configured',
      // };
      // return error;
      simulationInfo.success = false;
      simulationInfo.errorCode = '404';
      simulationInfo.externalId = undefined;
      return simulationInfo;
    }
  }
}
