import {
  Injectable,
  Logger,
  OnModuleInit,
  OnModuleDestroy,
} from '@nestjs/common';
import { config } from '../../../config';
import { LogV1Service } from './log-v1.service';
import { LogCreateV1Request } from '../dtos/requests/log-create-v1.request';

interface QueuedLog {
  clientId: string;
  apiKey: string;
  request: LogCreateV1Request;
}

@Injectable()
export class LogBatchV1Service implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(LogBatchV1Service.name);
  private readonly queue: QueuedLog[] = [];
  private flushInterval: NodeJS.Timeout | null = null;
  private readonly batchSize = config.queue.logBatchSize;
  private readonly flushIntervalMs = config.queue.logFlushIntervalMs;
  private isShuttingDown = false;

  constructor(private readonly logV1Service: LogV1Service) {}

  onModuleInit() {
    // Start periodic flush
    this.flushInterval = setInterval(() => {
      void this.flush();
    }, this.flushIntervalMs);

    this.logger.log(
      `Log batching initialized: batchSize=${this.batchSize}, flushInterval=${this.flushIntervalMs}ms`,
    );
  }

  async onModuleDestroy() {
    this.isShuttingDown = true;

    // Stop periodic flush
    if (this.flushInterval) {
      clearInterval(this.flushInterval);
    }

    // Flush remaining logs
    await this.flush();

    this.logger.log('Log batching service shut down');
  }

  /**
   * Add a log to the batch queue
   */
  async addToQueue(
    clientId: string,
    apiKey: string,
    request: LogCreateV1Request,
  ): Promise<void> {
    if (this.isShuttingDown) {
      // During shutdown, write directly
      await this.logV1Service.createLog(request, clientId);
      return;
    }

    this.queue.push({ clientId, apiKey, request });

    // Flush if batch size reached
    if (this.queue.length >= this.batchSize) {
      await this.flush();
    }
  }

  /**
   * Flush all queued logs to database
   */
  private async flush(): Promise<void> {
    if (this.queue.length === 0) {
      return;
    }

    // Take all items from queue
    const logsToWrite = this.queue.splice(0, this.queue.length);

    try {
      await this.logV1Service.createLogBatch(logsToWrite);
      this.logger.debug(`Flushed ${logsToWrite.length} logs to database`);
    } catch (error) {
      this.logger.error(
        `Failed to flush ${logsToWrite.length} logs`,
        error instanceof Error ? error.stack : error,
      );

      // Re-queue failed logs for retry
      this.queue.unshift(...logsToWrite);
    }
  }

  /**
   * Get current queue size
   */
  getQueueSize(): number {
    return this.queue.length;
  }
}
