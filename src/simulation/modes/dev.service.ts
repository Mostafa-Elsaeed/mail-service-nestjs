import { Injectable } from '@nestjs/common';
import { ISimulation } from '../simulation.interface';
@Injectable()
export class DevSimulationService implements ISimulation {
  run() {
    console.log('Sending Using with Dev Simulation');
  }
}
