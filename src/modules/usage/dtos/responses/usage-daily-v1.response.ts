import { IDailyUsageData } from '../../../log/repositories/log-v1.repository';

export class UsageDailyV1Response {
  date: string;
  count: number;

  static MapData(data: IDailyUsageData): UsageDailyV1Response {
    return {
      date: data.date,
      count: data.count,
    };
  }

  static MapDataList(dataList: IDailyUsageData[]): UsageDailyV1Response[] {
    return dataList.map((data) => this.MapData(data));
  }
}
