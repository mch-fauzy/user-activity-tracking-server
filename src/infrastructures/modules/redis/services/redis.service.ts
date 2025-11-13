import { Injectable, Logger, OnModuleDestroy } from '@nestjs/common';
import Redis, { Redis as RedisClient } from 'ioredis';
import { config } from '../../../../config';

@Injectable()
export class RedisService implements OnModuleDestroy {
  private readonly logger = new Logger(RedisService.name);
  private readonly client: RedisClient;
  private readonly subscriber: RedisClient;
  private readonly publisher: RedisClient;
  private isConnected: boolean = false;

  constructor() {
    const redisConfig = {
      host: config.redis.host,
      port: config.redis.port,
      password: config.redis.password || undefined,
      retryStrategy: (times: number) => {
        if (times > config.redis.maxRetries) {
          this.logger.error(
            `Max retries (${config.redis.maxRetries}) exceeded`,
          );
          return null;
        }
        const delay = Math.min(
          times * config.redis.retryDelay,
          config.redis.maxRetryDelay,
        );
        this.logger.warn(
          `Retrying Redis connection (attempt ${times}), delay: ${delay}ms`,
        );
        return delay;
      },
      maxRetriesPerRequest: config.redis.maxRetries,
    };

    this.client = new Redis(redisConfig);
    this.subscriber = new Redis(redisConfig);
    this.publisher = new Redis(redisConfig);

    this.client.on('connect', () => {
      this.isConnected = true;
      this.logger.log('Redis client connected');
    });

    this.client.on('error', (error) => {
      this.isConnected = false;
      this.logger.error('Redis client error:', error);
    });

    this.subscriber.on('connect', () => {
      this.logger.log('Redis subscriber connected');
    });

    this.publisher.on('connect', () => {
      this.logger.log('Redis publisher connected');
    });
  }

  onModuleDestroy() {
    this.client.disconnect();
    this.subscriber.disconnect();
    this.publisher.disconnect();
  }

  getConnectionStatus(): boolean {
    return this.isConnected;
  }

  /**
   * Get value from Redis
   */
  async get<T = string>(key: string): Promise<T | null> {
    try {
      const value = await this.client.get(key);
      if (!value) return null;

      try {
        return JSON.parse(value) as T;
      } catch {
        return value as T;
      }
    } catch (error) {
      this.logger.error(`Error getting key ${key}:`, error);
      return null;
    }
  }

  /**
   * Set value in Redis with optional TTL (in seconds)
   */
  async set<T>(key: string, value: T, ttl?: number): Promise<boolean> {
    try {
      const stringValue =
        typeof value === 'string' ? value : JSON.stringify(value);

      if (ttl) {
        await this.client.setex(key, ttl, stringValue);
      } else {
        await this.client.set(key, stringValue);
      }

      return true;
    } catch (error) {
      this.logger.error(`Error setting key ${key}:`, error);
      return false;
    }
  }

  /**
   * Delete one or more keys
   */
  async del(...keys: string[]): Promise<number> {
    try {
      return await this.client.del(...keys);
    } catch (error) {
      this.logger.error(`Error deleting keys:`, error);
      return 0;
    }
  }

  /**
   * Check if key exists
   */
  async exists(key: string): Promise<boolean> {
    try {
      const result = await this.client.exists(key);
      return result === 1;
    } catch (error) {
      this.logger.error(`Error checking existence of key ${key}:`, error);
      return false;
    }
  }

  /**
   * Get TTL of a key (in seconds)
   */
  async ttl(key: string): Promise<number> {
    try {
      return await this.client.ttl(key);
    } catch (error) {
      this.logger.error(`Error getting TTL of key ${key}:`, error);
      return -1;
    }
  }

  /**
   * Increment a key atomically
   */
  async incr(key: string): Promise<number> {
    try {
      return await this.client.incr(key);
    } catch (error) {
      this.logger.error(`Error incrementing key ${key}:`, error);
      throw error;
    }
  }

  /**
   * Increment a key by a specific amount atomically
   */
  async incrby(key: string, increment: number): Promise<number> {
    try {
      return await this.client.incrby(key, increment);
    } catch (error) {
      this.logger.error(
        `Error incrementing key ${key} by ${increment}:`,
        error,
      );
      throw error;
    }
  }

  /**
   * Set expiration on a key (in seconds)
   */
  async expire(key: string, seconds: number): Promise<boolean> {
    try {
      const result = await this.client.expire(key, seconds);
      return result === 1;
    } catch (error) {
      this.logger.error(`Error setting expiration on key ${key}:`, error);
      return false;
    }
  }

  /**
   * Get keys matching a pattern
   */
  async keys(pattern: string): Promise<string[]> {
    try {
      return await this.client.keys(pattern);
    } catch (error) {
      this.logger.error(`Error getting keys with pattern ${pattern}:`, error);
      return [];
    }
  }

  /**
   * Delete keys matching a pattern
   */
  async deletePattern(pattern: string): Promise<number> {
    try {
      const keys = await this.keys(pattern);
      if (keys.length === 0) return 0;
      return await this.del(...keys);
    } catch (error) {
      this.logger.error(`Error deleting keys with pattern ${pattern}:`, error);
      return 0;
    }
  }

  /**
   * Publish message to a channel
   */
  async publish<T>(channel: string, message: T): Promise<number> {
    try {
      const stringMessage =
        typeof message === 'string' ? message : JSON.stringify(message);
      return await this.publisher.publish(channel, stringMessage);
    } catch (error) {
      this.logger.error(`Error publishing to channel ${channel}:`, error);
      return 0;
    }
  }

  /**
   * Subscribe to a channel
   */
  async subscribe<T>(
    channel: string,
    callback: (message: T) => void,
  ): Promise<void> {
    try {
      await this.subscriber.subscribe(channel);

      this.subscriber.on('message', (ch, message) => {
        if (ch === channel) {
          try {
            const parsed = JSON.parse(message) as T;
            callback(parsed);
          } catch {
            callback(message as T);
          }
        }
      });

      this.logger.log(`Subscribed to channel: ${channel}`);
    } catch (error) {
      this.logger.error(`Error subscribing to channel ${channel}:`, error);
    }
  }

  /**
   * Unsubscribe from a channel
   */
  async unsubscribe(channel: string): Promise<void> {
    try {
      await this.subscriber.unsubscribe(channel);
      this.logger.log(`Unsubscribed from channel: ${channel}`);
    } catch (error) {
      this.logger.error(`Error unsubscribing from channel ${channel}:`, error);
    }
  }
}
