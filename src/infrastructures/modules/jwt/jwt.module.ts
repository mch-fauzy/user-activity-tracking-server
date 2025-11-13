import { Module } from '@nestjs/common';
import { JwtModule as JwtDefaultModule, JwtService } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { config } from '../../../config';
import { Client } from '../../database/entities/client.entity';
import { JwtStrategy } from './strategies/jwt.strategy';

@Module({
  imports: [
    PassportModule,
    JwtDefaultModule.register({
      secret: config.jwt.secret,
      signOptions: { expiresIn: `${config.jwt.expiresInSeconds}s` },
    }),
    TypeOrmModule.forFeature([Client]),
  ],
  providers: [JwtStrategy, JwtService],
  exports: [JwtStrategy, JwtService],
})
export class JwtModule {}
