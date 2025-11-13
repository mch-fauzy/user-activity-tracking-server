import * as dotenv from 'dotenv';
dotenv.config();

export const config = {
  nodeEnv: process.env.NODE_ENV ?? 'development',

  app: {
    name: process.env.APP_NAME ?? 'UserActivityTrackingServer',
    port: +(process.env.APP_PORT ?? 3000),
    tz: process.env.APP_TZ ?? 'UTC',
  },

  db: {
    host: process.env.DB_HOST ?? '127.0.0.1',
    port: +(process.env.DB_PORT ?? 5432),
    database: process.env.DB_DATABASE ?? 'user_activity_db',
    username: process.env.DB_USERNAME ?? 'postgres',
    password: process.env.DB_PASSWORD ?? 'postgres',
    poolSize: +(process.env.DB_POOL_SIZE ?? 10),
  },

  jwt: {
    secret: process.env.JWT_SECRET ?? '',
    expiresInSeconds: +(process.env.JWT_EXPIRES_IN_SECONDS ?? 86400), // 1 day
  },

  redis: {
    host: process.env.REDIS_HOST ?? '',
    port: +(process.env.REDIS_PORT ?? 6379),
    password: process.env.REDIS_PASSWORD ?? '',
  },
} as const;
