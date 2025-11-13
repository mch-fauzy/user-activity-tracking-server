import { Injectable, OnModuleInit } from '@nestjs/common';
import { LogV1Service } from '../../log/services/log-v1.service';
import { RedisService } from '../../../infrastructures/modules/redis/services/redis.service';
import { LocalCacheService } from '../../../infrastructures/modules/local-cache/services/local-cache.service';
import {
  IDailyUsageData,
  ITopClientData,
} from '../../log/repositories/log-v1.repository';
import { config } from '../../../config';
import {
  CacheKey,
  CacheChannel,
  UsageQuery,
} from '../../../shared/constants/cache.constant';
import { CacheUtil } from '../../../shared/utils/cache.util';

@Injectable()
export class UsageV1Service implements OnModuleInit {
  constructor(
    private readonly logV1Service: LogV1Service,
    private readonly redisService: RedisService,
    private readonly localCache: LocalCacheService,
  ) {}

  onModuleInit() {
    // Subscribe to log created events for cache invalidation
    void this.redisService.subscribe<{ clientId: string }>(
      CacheChannel.LogCreated,
      (message) => {
        void this.invalidateCache(message.clientId);
      },
    );
  }

  /**
   * Get daily usage for the logged-in client
   */
  async getDailyUsage(clientId: string): Promise<IDailyUsageData[]> {
    const cacheKey = `${CacheKey.UsageDailyPrefix}${clientId}`;

    // Try cache first
    const cachedData = await CacheUtil.get<IDailyUsageData[]>(
      this.redisService,
      this.localCache,
      cacheKey,
    );
    if (cachedData) {
      return cachedData;
    }

    const data = await this.logV1Service.getDailyUsageByClient(
      clientId,
      UsageQuery.DailyUsageDays,
    );

    // Store in cache without waiting
    void CacheUtil.set(
      this.redisService,
      this.localCache,
      cacheKey,
      data,
      config.cache.ttlUsage,
    );

    return data;
  }

  /**
   * Get top clients with highest requests
   */
  async getTopClients(): Promise<ITopClientData[]> {
    const cacheKey = CacheKey.UsageTop24h;

    // Try cache first (Redis with local fallback)
    const cachedData = await CacheUtil.get<ITopClientData[]>(
      this.redisService,
      this.localCache,
      cacheKey,
    );
    if (cachedData) {
      return cachedData;
    }

    // Cache miss - fetch from database
    const data = await this.logV1Service.getTopClients(
      UsageQuery.TopClientsHours,
      UsageQuery.TopClientsLimit,
    );

    // Store in cache without waiting
    void CacheUtil.set(
      this.redisService,
      this.localCache,
      cacheKey,
      data,
      config.cache.ttlUsage,
    );

    return data;
  }

  /**
   * Invalidate cache when new log is created
   */
  private async invalidateCache(clientId: string): Promise<void> {
    const dailyCacheKey = `${CacheKey.UsageDailyPrefix}${clientId}`;

    // Delete from both caches
    await CacheUtil.delete(
      this.redisService,
      this.localCache,
      dailyCacheKey,
      CacheKey.UsageTop24h,
    );
  }
}
