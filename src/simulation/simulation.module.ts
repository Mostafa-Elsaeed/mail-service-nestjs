import { Module } from '@nestjs/common';
import { SimulationController } from './simulation.controller';
import { SimulationService } from './simulation.service';
import { LoggingService } from './modes/logging.service';
import { DevSimulationService } from './modes/dev.service';
@Module({
  controllers: [SimulationController],
  providers: [SimulationService, LoggingService, DevSimulationService],
})
export class SimulationModule {}
