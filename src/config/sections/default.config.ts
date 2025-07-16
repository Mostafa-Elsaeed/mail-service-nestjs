import { appConfig } from './app/app.config';
import { databaseConfig } from './database/database.config';

export default () => ({
  ...appConfig(),
  ...databaseConfig(),
  //   ...jwtConfig(),
});
