import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { RedisService } from '../../infrastructures/modules/redis/services/redis.service';
import {
  RATE_LIMIT_KEY,
  IRateLimitOptions,
} from '../decorators/rate-limit.decorator';
import { IS_PUBLIC_KEY } from '../decorators/public.decorator';
import { config } from '../../config';
import { Client } from '../../infrastructures/database/entities/client.entity';
import { TooManyRequestsException } from '../exceptions/too-many-requests.exception';

@Injectable()
export class RateLimitGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly redisService: RedisService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    // Skip rate limiting for public routes
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPublic) {
      return true;
    }

    const request = context.switchToHttp().getRequest<{ user?: Client }>();
    const client = request.user;

    // If no authenticated user, skip rate limiting (JWT guard will handle it)
    if (!client) {
      return true;
    }

    // Get rate limit options from decorator or use defaults
    const rateLimitOptions =
      this.reflector.getAllAndOverride<IRateLimitOptions>(RATE_LIMIT_KEY, [
        context.getHandler(),
        context.getClass(),
      ]);

    const limit = rateLimitOptions?.limit ?? config.rateLimit.default;
    const windowSeconds =
      rateLimitOptions?.windowSeconds ?? config.rateLimit.windowSeconds;

    // Check rate limit using sliding window
    const isAllowed = await this.checkRateLimit(
      client.id,
      limit,
      windowSeconds,
    );

    if (!isAllowed) {
      throw new TooManyRequestsException(
        `Rate limit exceeded. Maximum ${limit} requests per ${windowSeconds} seconds`,
      );
    }

    return true;
  }

  /**
   * Sliding window rate limiting algorithm using Redis
   */
  private async checkRateLimit(
    clientId: string,
    limit: number,
    windowSeconds: number,
  ): Promise<boolean> {
    const key = `rate_limit:${clientId}`;

    try {
      // Get current count
      const currentCount = await this.redisService.get<number>(key);

      if (!currentCount) {
        // First request in window
        await this.redisService.set(key, 1, windowSeconds);
        return true;
      }

      if (currentCount >= limit) {
        // Rate limit exceeded
        return false;
      }

      // Increment counter
      await this.redisService.incr(key);

      // Ensure TTL is set (in case it was lost)
      const ttl = await this.redisService.ttl(key);
      if (ttl === -1) {
        await this.redisService.expire(key, windowSeconds);
      }

      return true;
    } catch {
      // If Redis is down, allow the request (fail open)
      // This prevents rate limiting from blocking all traffic if Redis fails
      return true;
    }
  }
}
