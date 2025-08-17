import { Module } from '@nestjs/common';

import { SimulationService } from './simulation.service';

import { DevSimulationService } from './modes/dev.service';
import { LoggingSimulationService } from './modes/logging.service';
import { ActionSimulationService } from './modes/action.service';
import { ConfigModule } from '../config/config.module';
import { MailAgentModule } from '../mail-agent/mail-agent.module';

@Module({
  imports: [ConfigModule, MailAgentModule],
  providers: [
    SimulationService,
    LoggingSimulationService,
    DevSimulationService,
    ActionSimulationService,
  ],
  exports: [SimulationService],
})
export class SimulationModule {}
