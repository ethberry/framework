import { CronExpression } from "../../../../entities";

export interface IRaffleScheduleUpdateDto {
  schedule: CronExpression;
}

export interface IRaffleScheduleUpdateRmq {
  address: string;
  schedule: CronExpression;
}
