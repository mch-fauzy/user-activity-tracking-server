import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiKeyAuthTypeEnum } from '../enums/api-key-type.enum';

@Injectable()
export class ApiKeyAuthGuard extends AuthGuard(ApiKeyAuthTypeEnum.ApiKey) {}
