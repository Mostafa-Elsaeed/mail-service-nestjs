import { appConfig } from './app/app.config';
import { databaseConfig } from './database/database.config';
import { mailProviderConfig } from './mail-providors/mail-provider.config';

export default () => ({
  ...appConfig(),
  ...databaseConfig(),
  ...mailProviderConfig(),
  //   ...jwtConfig(),
});
