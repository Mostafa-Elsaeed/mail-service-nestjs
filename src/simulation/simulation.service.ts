import { Injectable } from '@nestjs/common';
import { ISimulation } from './simulation.interface';
import { LoggingService } from './modes/logging.service';
import { DevSimulationService } from './modes/dev.service';

@Injectable()
export class SimulationService {
  constructor(
    private readonly loggingSimulation: LoggingService,
    private readonly devSimulation: DevSimulationService,
  ) {}
  simulation(simulationService: ISimulation) {
    simulationService.run();
  }

  testSimulation() {
    this.simulation(this.devSimulation);
  }
}
