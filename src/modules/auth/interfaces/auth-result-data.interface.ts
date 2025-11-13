import { Client } from '../../../infrastructures/database/entities/client.entity';

export interface IAuthResultData {
  client: Client;
  token: {
    accessToken: string;
    accessTokenExpiresIn: number;
  };
}
