import { Module } from '@nestjs/common';
import { MailService } from './mail.service';
import { MailController } from './mail.controller';
import { MailAgentModule } from 'src/mail-agent/mail-agent.module';

@Module({
  imports: [MailAgentModule],
  controllers: [MailController],
  providers: [MailService],
})
export class MailModule {}
