import { Injectable } from '@nestjs/common';
import { ISimulation } from '../simulation.interface';
@Injectable()
export class LoggingService implements ISimulation {
  run() {
    console.log('Sending Using with Logging Simulation');
  }
}
