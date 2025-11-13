import { Global, Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Client } from '../../database/entities/client.entity';
import { ApiKeyStrategy } from './strategies/api-key.strategy';

@Global()
@Module({
  imports: [PassportModule, TypeOrmModule.forFeature([Client])],
  providers: [ApiKeyStrategy],
  exports: [ApiKeyStrategy],
})
export class ApiKeyModule {}
