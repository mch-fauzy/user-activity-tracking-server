import { Module } from '@nestjs/common';
import { JwtModule as JwtDefaultModule } from '@nestjs/jwt';
import { ClientModule } from '../client/client.module';
import { AuthRegisterV1Controller } from './controllers/auth-register-v1.controller';
import { AuthLoginV1Controller } from './controllers/auth-login-v1.controller';
import { AuthV1Service } from './services/auth-v1.service';
import { AuthRegisterV1Service } from './services/auth-register-v1.service';
import { AuthLoginV1Service } from './services/auth-login-v1.service';

@Module({
  imports: [JwtDefaultModule, ClientModule],
  controllers: [AuthRegisterV1Controller, AuthLoginV1Controller],
  providers: [AuthV1Service, AuthRegisterV1Service, AuthLoginV1Service],
  exports: [AuthV1Service],
})
export class AuthModule {}
