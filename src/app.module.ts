import { Module } from '@nestjs/common';
import { APP_FILTER, APP_GUARD, APP_PIPE } from '@nestjs/core';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ZodValidationPipe } from 'nestjs-zod';
import { databaseConfig } from './infrastructures/database/config';
import { ApiKeyModule } from './infrastructures/modules/api-key/api-key.module';
import { JwtAuthGuard } from './infrastructures/modules/jwt/guards/jwt-auth.guard';
import { JwtModule } from './infrastructures/modules/jwt/jwt.module';
import { LocalCacheModule } from './infrastructures/modules/local-cache/local-cache.module';
import { RedisModule } from './infrastructures/modules/redis/redis.module';
import { AuthModule } from './modules/auth/auth.module';
import { ClientModule } from './modules/client/client.module';
import { LogModule } from './modules/log/log.module';
import { UsageModule } from './modules/usage/usage.module';
import { GlobalExceptionHandlerFilter } from './shared/filters/global-exception.filter';
import { RateLimitGuard } from './shared/guards/rate-limit.guard';

@Module({
  imports: [
    // Infrastructure
    TypeOrmModule.forRoot(databaseConfig),
    ApiKeyModule,
    JwtModule,
    RedisModule,
    LocalCacheModule,

    // Application Modules
    AuthModule,
    ClientModule,
    LogModule,
    UsageModule,
  ],
  providers: [
    {
      provide: APP_FILTER,
      useClass: GlobalExceptionHandlerFilter,
    },
    {
      provide: APP_PIPE,
      useClass: ZodValidationPipe,
    },
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
    {
      provide: APP_GUARD,
      useClass: RateLimitGuard,
    },
  ],
})
export class AppModule {}
