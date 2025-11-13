import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Client } from '../../infrastructures/database/entities/client.entity';
import { ClientV1Repository } from './repositories/client-v1.repository';

@Module({
  imports: [TypeOrmModule.forFeature([Client])],
  providers: [ClientV1Repository],
  exports: [ClientV1Repository],
})
export class ClientModule {}
