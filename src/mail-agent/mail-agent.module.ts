import { Module } from '@nestjs/common';
import { MailAgentService } from './mail-agent.service';
import { MailGunService } from './providers/mail-gun/mail-gun.service';

import { OutlookService } from './providers/outlook.service';
import { ConfigModule } from 'src/config/config.module';

@Module({
  imports: [ConfigModule],
  providers: [MailAgentService, MailGunService, OutlookService],
  exports: [MailAgentService],
})
export class MailAgentModule {}
