import { DataSource, DataSourceOptions } from 'typeorm';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';
import { config } from '../../config';

export const databaseConfig: DataSourceOptions = {
  type: 'postgres',
  host: config.db.host,
  port: config.db.port,
  username: config.db.username,
  password: config.db.password,
  database: config.db.database,
  entities: [`${__dirname}/entities/**/*{.ts,.js}`],
  synchronize: false,
  logging: config.nodeEnv === 'development',
  migrations: [`${__dirname}/migrations/*.ts`],
  namingStrategy: new SnakeNamingStrategy(),
  poolSize: config.db.poolSize,
  ssl: config.db.ssl
    ? {
        rejectUnauthorized: false,
      }
    : false,
  extra: {
    options: `-c timezone=${config.app.tz}`,
  },
};

const dataSource = new DataSource(databaseConfig);
export default dataSource;
