import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ErrorMessageConstant } from '../../../shared/constants/message.constant';
import { HashUtil } from '../../../shared/utils/hash.util';
import { AuthLoginV1Request } from '../dtos/requests/auth-login-v1.request';
import { IAuthResultData } from '../interfaces/auth-result-data.interface';
import { ClientV1Repository } from '../../client/repositories/client-v1.repository';
import { AuthV1Service } from './auth-v1.service';

@Injectable()
export class AuthLoginV1Service {
  constructor(
    private readonly authService: AuthV1Service,
    private readonly clientV1Repository: ClientV1Repository,
  ) {}

  /**
   * Authenticates a client and generates a JWT token
   */
  async login(request: AuthLoginV1Request): Promise<IAuthResultData> {
    const { email, password } = request;

    // Find the client by email
    const client = await this.clientV1Repository.findOneByEmail(email);

    if (!client) {
      throw new UnauthorizedException(ErrorMessageConstant.InvalidCredentials);
    }

    // Check if the password is correct
    const isPasswordValid = await HashUtil.comparePassword(
      password,
      client.password,
    );

    if (!isPasswordValid) {
      throw new UnauthorizedException(ErrorMessageConstant.InvalidCredentials);
    }

    // Generate JWT token
    const token = await this.authService.generateToken(client);

    return {
      client,
      token: {
        accessToken: token,
        accessTokenExpiresIn: this.authService.JWT_EXPIRES_IN_SECONDS,
      },
    };
  }
}
