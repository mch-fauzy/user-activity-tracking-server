import { Client } from '../../../../infrastructures/database/entities/client.entity';

export class AuthClientV1Response {
  id: string;
  name: string;
  email: string;
  apiKey: string;
  createdAt: Date;
  updatedAt: Date;

  static MapEntity(entity: Client): AuthClientV1Response {
    return {
      id: entity.id,
      name: entity.name,
      email: entity.email,
      apiKey: entity.apiKey,
      createdAt: entity.createdAt!,
      updatedAt: entity.updatedAt!,
    };
  }
}
