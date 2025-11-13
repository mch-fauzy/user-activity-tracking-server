import { Injectable, NotFoundException } from '@nestjs/common';
import {
  LogV1Repository,
  IDailyUsageData,
  ITopClientData,
} from '../repositories/log-v1.repository';
import { LogCreateV1Request } from '../dtos/requests/log-create-v1.request';
import { ClientV1Repository } from '../../client/repositories/client-v1.repository';
import { ErrorMessageConstant } from '../../../shared/constants/message.constant';
import { CacheChannel } from '../../../shared/constants/cache.constant';
import { RedisService } from '../../../infrastructures/modules/redis/services/redis.service';

@Injectable()
export class LogV1Service {
  constructor(
    private readonly logV1Repository: LogV1Repository,
    private readonly clientV1Repository: ClientV1Repository,
    private readonly redisService: RedisService,
  ) {}

  /**
   * Create a single log entry
   */
  async createLog(
    request: LogCreateV1Request,
    clientId: string,
  ): Promise<void> {
    // Verify client exists
    const client = await this.clientV1Repository.findOneById(clientId);
    if (!client) {
      throw new NotFoundException(
        ErrorMessageConstant.DataEntityNotFound('Client'),
      );
    }

    // Create log
    const log = this.logV1Repository.create({
      clientId,
      apiKey: client.apiKey,
      ipAddress: request.ipAddress,
      endpoint: request.endpoint,
      method: request.method,
      timestamp: request.timestamp,
      createdBy: clientId,
    });

    await this.logV1Repository.save(log);

    // Publish event for cache invalidation
    await this.redisService.publish(CacheChannel.LogCreated, { clientId });
  }

  /**
   * Create multiple log entries in batch
   */
  async createLogBatch(
    logs: Array<{
      clientId: string;
      apiKey: string;
      request: LogCreateV1Request;
    }>,
  ): Promise<void> {
    if (logs.length === 0) return;

    const logEntities = logs.map(({ clientId, apiKey, request }) => ({
      clientId,
      apiKey,
      ipAddress: request.ipAddress,
      endpoint: request.endpoint,
      method: request.method,
      timestamp: request.timestamp,
      createdBy: clientId,
    }));

    await this.logV1Repository.createBatch(logEntities);

    // Publish events for cache invalidation
    const uniqueClientIds = [...new Set(logs.map((l) => l.clientId))];
    await Promise.all(
      uniqueClientIds.map((clientId) =>
        this.redisService.publish(CacheChannel.LogCreated, { clientId }),
      ),
    );
  }

  /**
   * Get daily usage statistics for a client
   */
  async getDailyUsageByClient(
    clientId: string,
    days: number = 7,
  ): Promise<IDailyUsageData[]> {
    // Verify client exists
    const client = await this.clientV1Repository.findOneById(clientId);
    if (!client) {
      throw new NotFoundException(
        ErrorMessageConstant.DataEntityNotFound('Client'),
      );
    }

    return await this.logV1Repository.getDailyUsageByClient(clientId, days);
  }

  /**
   * Get top clients by request count
   */
  async getTopClients(
    hours: number = 24,
    limit: number = 3,
  ): Promise<ITopClientData[]> {
    return await this.logV1Repository.getTopClients(hours, limit);
  }
}
