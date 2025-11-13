import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-http-bearer';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Client } from '../../../database/entities/client.entity';
import { EncryptionUtils } from '../../../../shared/utils/encryption.util';
import { ApiKeyAuthTypeEnum } from '../enums/api-key-type.enum';

@Injectable()
export class ApiKeyStrategy extends PassportStrategy(
  Strategy,
  ApiKeyAuthTypeEnum.ApiKey,
) {
  constructor(
    @InjectRepository(Client)
    private readonly clientRepository: Repository<Client>,
  ) {
    super();
  }

  async validate(apiKey: string): Promise<Client> {
    if (!apiKey) {
      throw new UnauthorizedException('API key is required');
    }

    const encryptedApiKey = EncryptionUtils.encryptDeterministic(apiKey);

    // Find client by encrypted key
    const client = await this.clientRepository.findOne({
      where: { apiKey: encryptedApiKey },
    });

    if (!client) {
      throw new UnauthorizedException('Invalid API key');
    }

    return client;
  }
}
