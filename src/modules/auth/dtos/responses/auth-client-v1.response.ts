import { MaskUtil } from 'src/shared/utils/mask.util';
import { Client } from '../../../../infrastructures/database/entities/client.entity';

export class AuthClientV1Response {
  id: string;
  name: string;
  email: string;
  createdAt: Date;
  updatedAt: Date;

  static MapEntity(entity: Client): AuthClientV1Response {
    return {
      id: entity.id,
      name: entity.name,
      email: MaskUtil.email(entity.email),
      createdAt: entity.createdAt!,
      updatedAt: entity.updatedAt!,
    };
  }
}
