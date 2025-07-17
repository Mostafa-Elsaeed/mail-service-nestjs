import { DataSource } from 'typeorm';
import { Seeder, SeederFactoryManager } from 'typeorm-extension';

export default class UserSeeder implements Seeder {
  public async run(
    dataSource: DataSource,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    factoryManager: SeederFactoryManager,
  ): Promise<void> {
    console.log(dataSource);
    await Promise.resolve(console.log('Running UserSeeder...'));
    // Clear existing users
    // await dataSource.query('TRUNCATE "users" RESTART IDENTITY;');
    // const repository = dataSource.getRepository(UserEntity);
    // Create users using a separate method for better organization
    // await this.createUsers(repository);
  }
}
