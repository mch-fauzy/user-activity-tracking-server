import { Log } from '../../../../infrastructures/database/entities/log.entity';

export class LogV1Response {
  id: string;
  clientId: string;
  apiKey: string;
  ipAddress: string;
  endpoint: string;
  method: string;
  timestamp: number;
  createdAt: Date;

  static MapEntity(entity: Log): LogV1Response {
    return {
      id: entity.id,
      clientId: entity.clientId,
      apiKey: entity.apiKey,
      ipAddress: entity.ipAddress,
      endpoint: entity.endpoint,
      method: entity.method,
      timestamp: entity.timestamp,
      createdAt: entity.createdAt!,
    };
  }

  static MapEntities(entities: Log[]): LogV1Response[] {
    return entities.map((entity) => this.MapEntity(entity));
  }
}
