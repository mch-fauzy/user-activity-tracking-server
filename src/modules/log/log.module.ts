import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Log } from '../../infrastructures/database/entities/log.entity';
import { ClientModule } from '../client/client.module';
import { LogV1Controller } from './controllers/log-v1.controller';
import { LogV1Service } from './services/log-v1.service';
import { LogBatchV1Service } from './services/log-batch-v1.service';
import { LogV1Repository } from './repositories/log-v1.repository';

@Module({
  imports: [TypeOrmModule.forFeature([Log]), ClientModule],
  controllers: [LogV1Controller],
  providers: [LogV1Service, LogBatchV1Service, LogV1Repository],
  exports: [LogV1Service, LogBatchV1Service],
})
export class LogModule {}
