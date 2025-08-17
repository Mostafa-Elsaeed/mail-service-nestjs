import { Injectable } from '@nestjs/common';

import { DevSimulationService } from './modes/dev.service';
import { ActionSimulationService } from './modes/action.service';
import { LoggingSimulationService } from './modes/logging.service';
import { ConfigService } from '../config/config.service';
import { NodeEnvEnum } from 'src/config/sections/app/node-env.enum';
import { SendMailDto } from 'src/mail/dto/send.dto';
import { SimulationModesService } from './simulation-modes.service';

@Injectable()
export class SimulationService {
  constructor(
    private readonly loggingSimulation: LoggingSimulationService,
    private readonly devSimulation: DevSimulationService,
    private readonly actionSimulation: ActionSimulationService,
    private readonly configService: ConfigService,
  ) {}
  private simulation(
    simulationService: SimulationModesService,
    sendMailDto: SendMailDto,
  ) {
    simulationService.run(sendMailDto);
  }

  private getSimulationMode() {
    const nodeEnv = this.configService.app.nodeEnv;
    const simulations: Record<NodeEnvEnum, SimulationModesService> = {
      [NodeEnvEnum.DEVELOPMENT]: this.loggingSimulation,
      [NodeEnvEnum.STAGING]: this.devSimulation,
      [NodeEnvEnum.PRODUCTION]: this.actionSimulation,
    };
    return simulations[nodeEnv];
  }

  runSimulation(sendMailDto: SendMailDto) {
    const simulationMode = this.getSimulationMode();
    this.simulation(simulationMode, sendMailDto);
  }
}
