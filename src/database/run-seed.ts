import { runSeeders } from 'typeorm-extension';
import { config } from 'dotenv';
import { AppDataSource } from './database.config';
// Load environment variables
config();

async function main() {
  console.log('Starting database seeding...');

  // Import your database config dynamically

  try {
    // Initialize the data source
    if (!AppDataSource.isInitialized) {
      await AppDataSource.initialize();
      console.log('Data source has been initialized');
    }

    // Run the seeds
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call
    await runSeeders(AppDataSource, {
      seeds: ['src/database/seeds/**/*{.ts,.js}'],
    });

    console.log('Seeding completed successfully');
    process.exit(0);
  } catch (error) {
    console.error('Error during seeding:', error);
    process.exit(1);
  }
}

main();
