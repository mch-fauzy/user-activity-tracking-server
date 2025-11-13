import { IAuthResultData } from '../../interfaces/auth-result-data.interface';
import { AuthClientV1Response } from './auth-client-v1.response';

export class AuthV1Response {
  client: AuthClientV1Response;
  token: {
    accessToken: string;
    accessTokenExpiresIn: number;
  };

  static MapEntity(entity: IAuthResultData): AuthV1Response {
    return {
      client: AuthClientV1Response.MapEntity(entity.client),
      token: {
        accessToken: entity.token.accessToken,
        accessTokenExpiresIn: entity.token.accessTokenExpiresIn,
      },
    };
  }
}
