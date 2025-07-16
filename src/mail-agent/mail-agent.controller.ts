import { Controller, Post } from '@nestjs/common';
import { MailAgentService } from './mail-agent.service';

@Controller('mail-agent')
export class MailAgentController {
  constructor(
    private readonly mailAgentService: MailAgentService, // Replace 'any' with the actual service type
  ) {}
  @Post('test')
  testEndpoint() {
    this.mailAgentService.testMailGun();
  }
}
