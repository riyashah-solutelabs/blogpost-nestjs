// import { DataSource, DataSourceOptions } from 'typeorm';
// console.log(process.env.DB_PASSWORD);
// export const appDataSource = new DataSource({
//   type: 'postgres',
//   host: 'localhost',
//   port: 5432,
//   username: 'postgres',
//   password: 'riyaa@2967',
//   database: 'bookmark',
//   entities: ['dist/**/*.entity.js'],
//   migrations: [__dirname + '/migrations/*.{ts,js}'],
//   factories: [__dirname + '/database/factories/*.{ts,js}'],
//   seeds: [__dirname + '/database/seeds/*.{ts,js}'],
//   extra: {
//     charset: 'utf8mb4_unicode_ci',
//   },
//   synchronize: false,
// } as DataSourceOptions);

// Docker postgres
// import dotenv from 'dotenv';
// require('dotenv').config({path: __dirname+ '../.env'})
import { DataSource, DataSourceOptions } from 'typeorm';
console.log(process.env.DB_PASSWORD, process.env.DB_NAME);
export const appDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST,
  port: +process.env.DB_PORT,
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  // entities: ['dist/**/**/*.entity.js'],
  entities: [__dirname + '/**/*.entity{.ts,.js}'],
  migrations: [__dirname + '/migrations/*.{ts,js}'],
  factories: [__dirname + '/database/factories/*.{ts,js}'],
  seeds: [__dirname + '/database/seeds/*.{ts,js}'],
  extra: {
    charset: 'utf8mb4_unicode_ci',
  },
  synchronize: false,
} as DataSourceOptions);
