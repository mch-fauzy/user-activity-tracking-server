import { MaskUtil } from 'src/shared/utils/mask.util';
import { ITopClientData } from '../../../log/repositories/log-v1.repository';

export class UsageTopV1Response {
  clientId: string;
  clientName: string;
  clientEmail: string;
  totalRequests: number;

  static MapData(data: ITopClientData): UsageTopV1Response {
    return {
      clientId: data.clientId,
      clientName: data.clientName,
      clientEmail: MaskUtil.email(data.clientEmail),
      totalRequests: data.totalRequests,
    };
  }

  static MapDataList(dataList: ITopClientData[]): UsageTopV1Response[] {
    return dataList.map((data) => this.MapData(data));
  }
}
