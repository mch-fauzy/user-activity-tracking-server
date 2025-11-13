import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Log } from '../../../infrastructures/database/entities/log.entity';

export interface IDailyUsageData {
  date: string;
  count: number;
}

export interface ITopClientData {
  clientId: string;
  clientName: string;
  clientEmail: string;
  totalRequests: number;
}

@Injectable()
export class LogV1Repository extends Repository<Log> {
  constructor(
    @InjectRepository(Log)
    repo: Repository<Log>,
  ) {
    super(repo.target, repo.manager, repo.queryRunner);
  }

  /**
   * Batch insert logs for high concurrency
   */
  async createBatch(logs: Partial<Log>[]): Promise<void> {
    if (logs.length === 0) return;
    await this.insert(logs);
  }

  /**
   * Get daily usage statistics for a client over the last N days
   */
  async getDailyUsageByClient(
    clientId: string,
    days: number,
  ): Promise<IDailyUsageData[]> {
    const result = await this.createQueryBuilder('log')
      .select('DATE(log.createdAt)', 'date')
      .addSelect('COUNT(*)', 'count')
      .where('log.clientId = :clientId', { clientId })
      .andWhere("log.createdAt >= NOW() - INTERVAL '1 day' * :days", { days })
      .groupBy('DATE(log.createdAt)')
      .orderBy('DATE(log.createdAt)', 'ASC')
      .getRawMany<Pick<IDailyUsageData, 'date'> & { count: string }>();

    return result.map((row) => ({
      date: row.date,
      count: parseInt(row.count, 10),
    }));
  }

  /**
   * Get top N clients by request count in the last N hours
   */
  async getTopClients(hours: number, limit: number): Promise<ITopClientData[]> {
    const result = await this.createQueryBuilder('log')
      .select('log.clientId', 'clientId')
      .addSelect('client.name', 'clientName')
      .addSelect('client.email', 'clientEmail')
      .addSelect('COUNT(*)', 'totalRequests')
      .leftJoin('log.client', 'client')
      .where("log.createdAt >= NOW() - INTERVAL '1 hour' * :hours", { hours })
      .groupBy('log.clientId')
      .addGroupBy('client.name')
      .addGroupBy('client.email')
      .orderBy('COUNT(*)', 'DESC')
      .limit(limit)
      .getRawMany<
        Omit<ITopClientData, 'totalRequests'> & { totalRequests: string }
      >();

    return result.map((row) => ({
      clientId: row.clientId,
      clientName: row.clientName,
      clientEmail: row.clientEmail,
      totalRequests: parseInt(row.totalRequests, 10),
    }));
  }
}
