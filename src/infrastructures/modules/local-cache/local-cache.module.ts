import { Global, Module } from '@nestjs/common';
import { LocalCacheService } from './services/local-cache.service';

@Global()
@Module({
  providers: [LocalCacheService],
  exports: [LocalCacheService],
})
export class LocalCacheModule {}
