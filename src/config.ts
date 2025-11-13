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
    ssl: process.env.DB_SSL === 'true',
  },

  jwt: {
    secret: process.env.JWT_SECRET ?? '',
    expiresInSeconds: +(process.env.JWT_EXPIRES_IN_SECONDS ?? 86400), // 1 day
  },

  encryption: {
    secret: process.env.ENCRYPTION_SECRET ?? process.env.JWT_SECRET ?? '',
  },

  redis: {
    host: process.env.REDIS_HOST ?? '',
    port: +(process.env.REDIS_PORT ?? 6379),
    password: process.env.REDIS_PASSWORD ?? '',
    tls: process.env.REDIS_TLS === 'true',
    maxRetries: +(process.env.REDIS_MAX_RETRIES ?? 3),
    retryDelay: +(process.env.REDIS_RETRY_DELAY ?? 50),
    maxRetryDelay: +(process.env.REDIS_MAX_RETRY_DELAY ?? 2000),
  },

  cache: {
    ttlUsage: +(process.env.CACHE_TTL_USAGE ?? 3600), // 1 hour
    localMaxSizeEntries: +(process.env.LOCAL_CACHE_MAX_SIZE_ENTRIES ?? 500),
  },

  rateLimit: {
    default: +(process.env.RATE_LIMIT_DEFAULT ?? 1000),
    windowSeconds: +(process.env.RATE_LIMIT_WINDOW_SECONDS ?? 3600), // 1 hour
  },

  queue: {
    logBatchSize: +(process.env.QUEUE_LOG_BATCH_SIZE ?? 100),
    logFlushIntervalMs: +(process.env.QUEUE_LOG_FLUSH_INTERVAL_MS ?? 5000),
  },
} as const;
