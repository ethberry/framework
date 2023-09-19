import { CronExpression } from "../../../../entities";

export interface ILotteryScheduleUpdateDto {
  schedule: CronExpression;
}

export interface ILotteryScheduleUpdateRmq {
  address: string;
  schedule: CronExpression;
}
