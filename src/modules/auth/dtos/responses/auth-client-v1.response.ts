import { Client } from '../../../../infrastructures/database/entities/client.entity';
import { MaskUtil } from '../../../../shared/utils/mask.util';

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
