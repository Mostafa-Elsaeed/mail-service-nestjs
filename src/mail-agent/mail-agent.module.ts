import { Module } from '@nestjs/common';
import { MailAgentService } from './mail-agent.service';

import { OutlookService } from './providers/outlook.service';
import { ConfigModule } from 'src/config/config.module';
import { MailGunService } from './providers/mail-gun.service';

@Module({
  imports: [ConfigModule],
  providers: [MailAgentService, MailGunService, OutlookService],
  exports: [MailAgentService],
})
export class MailAgentModule {}
