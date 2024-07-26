import { CronExpression } from "../../../../../entities";

export interface IRaffleScheduleUpdateDto {
  schedule: CronExpression;
}

export interface IRaffleScheduleUpdateRmq {
  address: string;
  chainId: number;
  schedule: CronExpression;
}
