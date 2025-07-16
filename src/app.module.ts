import { Module } from '@nestjs/common';
import { ConfigModule } from './config/config.module';
import { MailAgentModule } from './mail-agent/mail-agent.module';
import { SimulationModule } from './simulation/simulation.module';

@Module({
  imports: [ConfigModule, MailAgentModule, SimulationModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
