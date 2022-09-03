import { DataSource } from 'typeorm';

const dataSource = new DataSource({
  type: 'sqlite',
  database: './db.sqllite',
  entities: ['server/src/entity/**/*.ts'],
  synchronize: true,
  logging: false,
});

let isInitialized = false;
export async function getDatasource(): Promise<DataSource> {
  if (isInitialized) {
    return dataSource;
  }

  await dataSource.initialize();
  isInitialized = true;

  return dataSource;
}
