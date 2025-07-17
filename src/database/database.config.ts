import { DataSource } from 'typeorm';
import * as dotenv from 'dotenv';
import { join } from 'path';
// import { SeederOptions } from 'typeorm-extension';

// Load environment variables from .env file
console.log(
  'Database entities path:',
  join(__dirname + '/migrations/**/*{.ts,.js}'),
);

dotenv.config();

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DATABASE_HOST || 'localhost',
  port: parseInt(process.env.DATABASE_PORT || '5432'),
  username: process.env.DATABASE_USERNAME || 'postgres',
  password: process.env.DATABASE_PASSWORD || 'postgres',
  database: process.env.DATABASE_NAME || 'my_database',
  schema: process.env.DATABASE_SCHEMA || 'public',
  //   entities: [__dirname + "/**/*.entity{.ts,.js}"],
  entities: [join(__dirname, '..', '**', '*.entity{.ts,.js}')],
  migrations: [__dirname + '/migrations/**/*{.ts,.js}'],

  synchronize: process.env.NODE_ENV !== 'production', // Automatically create database schema (not recommended for production)
  logging: process.env.NODE_ENV !== 'production',
  ...(process.env.NODE_ENV === 'production'
    ? {
        ssl: {
          rejectUnauthorized: true,
        },
      }
    : {}),
  // ssl: {
  //   rejectUnauthorized: true,
  // },
});

// const options: DataSourceOptions & SeederOptions = {
//   type: 'postgres',
//   host: process.env.DATABASE_HOST || 'localhost',
//   port: parseInt(process.env.DATABASE_PORT || '5432'),
//   username: process.env.DATABASE_USERNAME || 'postgres',
//   password: process.env.DATABASE_PASSWORD || 'postgres',
//   database: process.env.DATABASE_NAME || 'my_database',
//   schema: process.env.DATABASE_SCHEMA || 'public',
//   //   entities: [__dirname + "/**/*.entity{.ts,.js}"],
//   entities: [join(__dirname, '..', '**', '*.entity{.ts,.js}')],
//   migrations: [__dirname + '/migrations/**/*{.ts,.js}'],
//   seeds: [__dirname + '/seeds/**/*{.ts,.js}'],
//   synchronize: process.env.NODE_ENV !== 'production', // Automatically create database schema (not recommended for production)
//   logging: process.env.NODE_ENV !== 'production',
//   ...(process.env.NODE_ENV === 'production'
//     ? {
//         ssl: {
//           rejectUnauthorized: true,
//         },
//       }
//     : {}),
//   // ssl: {
//   //   rejectUnauthorized: true,
//   // },
// };
// export const AppDataSource = new DataSource(options);
