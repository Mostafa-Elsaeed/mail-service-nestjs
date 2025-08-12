import { appConfig } from './app/app.config';
import { databaseConfig } from './database/database.config';
import { mailProviderConfig } from './mail-providors/mail-provider.config';
import { rabbitMqConfig } from './rabbit-mq/rabbit-mq.config';

export default () => ({
  ...appConfig(),
  ...databaseConfig(),
  ...mailProviderConfig(),
  ...rabbitMqConfig(),
  //   ...jwtConfig(),
});
