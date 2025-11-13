import { Module } from '@nestjs/common';
import { LogModule } from '../log/log.module';
import { UsageV1Controller } from './controllers/usage-v1.controller';
import { UsageV1Service } from './services/usage-v1.service';

@Module({
  imports: [LogModule],
  controllers: [UsageV1Controller],
  providers: [UsageV1Service],
  exports: [UsageV1Service],
})
export class UsageModule {}
