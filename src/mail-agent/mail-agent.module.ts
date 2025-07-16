import { Module } from '@nestjs/common';
import { MailAgentService } from './mail-agent.service';
import { MailGunService } from './providers/mail-gun.service';
import { MailAgentController } from './mail-agent.controller';
import { OutlookService } from './providers/outlook.service';

@Module({
  providers: [MailAgentService, MailGunService, OutlookService],
  controllers: [MailAgentController],
})
export class MailAgentModule {}
