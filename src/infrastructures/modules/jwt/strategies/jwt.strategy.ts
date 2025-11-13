import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { config } from '../../../../config';
import { IJwtPayload } from '../interfaces/jwt-payload.interface';
import { JwtAuthTypeEnum } from '../enums/jwt-type.enum';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Client } from '../../../database/entities/client.entity';

@Injectable()
export class JwtStrategy extends PassportStrategy(
  Strategy,
  JwtAuthTypeEnum.AccessToken,
) {
  constructor(
    @InjectRepository(Client)
    private readonly clientRepository: Repository<Client>,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: config.jwt.secret,
    });
  }

  async validate(payload: IJwtPayload): Promise<Client> {
    const { id } = payload;
    const client = await this.clientRepository.findOne({
      where: { id },
    });

    if (!client) {
      throw new UnauthorizedException('Unauthorized');
    }

    return client;
  }
}
