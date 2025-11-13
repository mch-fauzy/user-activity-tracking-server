import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { config } from '../../../config';
import { IJwtPayload } from '../../../infrastructures/modules/jwt/interfaces/jwt-payload.interface';
import { Client } from '../../../infrastructures/database/entities/client.entity';

@Injectable()
export class AuthV1Service {
  constructor(private readonly jwtService: JwtService) {}

  public readonly JWT_SECRET = config.jwt.secret;
  public readonly JWT_EXPIRES_IN_SECONDS = config.jwt.expiresInSeconds;

  /**
   * Generates a JWT token for the given client.
   */
  async generateToken(client: Client): Promise<string> {
    const payload: IJwtPayload = {
      id: client.id,
      name: client.name,
      email: client.email,
    };

    return await this.jwtService.signAsync(payload, {
      expiresIn: this.JWT_EXPIRES_IN_SECONDS,
      secret: this.JWT_SECRET,
    });
  }

  /**
   * Generates a unique API key for client
   */
  generateApiKey(): string {
    const timestamp = Date.now().toString(36);
    const randomStr = Math.random().toString(36).substring(2, 15);
    return `ak_${timestamp}_${randomStr}`;
  }
}
