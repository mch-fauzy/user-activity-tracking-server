import { Module } from '@nestjs/common';
import { APP_FILTER, APP_GUARD, APP_PIPE } from '@nestjs/core';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ZodValidationPipe } from 'nestjs-zod';
import { databaseConfig } from './infrastructures/database/config';
import { JwtAuthGuard } from './infrastructures/modules/jwt/guards/jwt-auth.guard';
import { JwtModule } from './infrastructures/modules/jwt/jwt.module';
import { AuthModule } from './modules/auth/auth.module';
import { ClientModule } from './modules/client/client.module';
import { GlobalExceptionHandlerFilter } from './shared/filters/global-exception.filter';

@Module({
  imports: [
    // Infrastructure
    TypeOrmModule.forRoot(databaseConfig),
    JwtModule,

    // Application Modules
    AuthModule,
    ClientModule,
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
  ],
})
export class AppModule {}
