import { Injectable } from '@nestjs/common';
import { ConfigService as NestConfigService } from '@nestjs/config';
import { IDatabaseConfig } from './sections/database/database.interface';
import { IAppConfig } from './sections/app/app.interface';
import { IMailProviderConfig } from './sections/mail-providors/mail-provider.interface';
import { IRabbitMqConfig } from './sections/rabbit-mq/rabbit-mq.interface';

@Injectable()
export class ConfigService {
  constructor(private configService: NestConfigService) {}

  get app(): IAppConfig {
    return this.configService.get<IAppConfig>('app') as IAppConfig;
  }

  get database(): IDatabaseConfig {
    return this.configService.get<IDatabaseConfig>(
      'database',
    ) as IDatabaseConfig;
  }

  get mailProvider(): IMailProviderConfig {
    return this.configService.get<IMailProviderConfig>(
      'mailProvider',
    ) as IMailProviderConfig;
  }

  get rabbitMq() {
    return this.configService.get<IRabbitMqConfig>(
      'rabbitMq',
    ) as IRabbitMqConfig;
  }
}
