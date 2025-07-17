import { Module } from '@nestjs/common';
import { ConfigModule } from './config/config.module';
import { DatabaseModule } from './database/database.module';
import { MailAgentModule } from './mail-agent/mail-agent.module';
import { SimulationModule } from './simulation/simulation.module';
import { MailModule } from './mail/mail.module';

@Module({
  imports: [ConfigModule, DatabaseModule, MailAgentModule, SimulationModule, MailModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
