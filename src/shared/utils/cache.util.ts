import { RedisService } from '../../infrastructures/modules/redis/services/redis.service';
import { LocalCacheService } from '../../infrastructures/modules/local-cache/services/local-cache.service';

export class CacheUtil {
  /**
   * Get data from cache with fallback strategy
   * Try Redis first, then local cache if Redis is unavailable
   *
   * @param redisService - Redis service instance
   * @param localCache - Local cache service instance
   * @param cacheKey - Cache key to retrieve
   * @returns Cached data if found, null otherwise
   */
  static async get<T>(
    redisService: RedisService,
    localCache: LocalCacheService,
    cacheKey: string,
  ): Promise<T | null> {
    // Try Redis first
    if (redisService.getConnectionStatus()) {
      const cachedData = await redisService.get<T>(cacheKey);
      if (cachedData) {
        return cachedData;
      }
    } else {
      // Redis unavailable, try local cache
      const localData = localCache.get<T>(cacheKey);
      if (localData) {
        return localData;
      }
    }

    return null;
  }

  /**
   * Set data in both Redis and local cache
   * If Redis is unavailable, only local cache will be used
   *
   * @param redisService - Redis service instance
   * @param localCache - Local cache service instance
   * @param cacheKey - Cache key to store
   * @param data - Data to cache
   * @param ttl - Time to live in seconds
   */
  static async set<T>(
    redisService: RedisService,
    localCache: LocalCacheService,
    cacheKey: string,
    data: T,
    ttl: number,
  ): Promise<void> {
    // Store in Redis if available
    if (redisService.getConnectionStatus()) {
      await redisService.set(cacheKey, data, ttl);
    }

    // Always store in local cache
    localCache.set(cacheKey, data, ttl);
  }

  /**
   * Delete data from both Redis and local cache
   *
   * @param redisService - Redis service instance
   * @param localCache - Local cache service instance
   * @param cacheKeys - Cache keys to delete
   */
  static async delete(
    redisService: RedisService,
    localCache: LocalCacheService,
    ...cacheKeys: string[]
  ): Promise<void> {
    // Delete from Redis if available
    if (redisService.getConnectionStatus()) {
      await redisService.del(...cacheKeys);
    }

    // Delete from local cache
    for (const key of cacheKeys) {
      localCache.delete(key);
    }
  }
}
