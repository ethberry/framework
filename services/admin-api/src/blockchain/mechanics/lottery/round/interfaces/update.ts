import { CronExpression } from "@framework/types";

export interface ILotteryScheduleUpdate {
  address: string;
  schedule: CronExpression;
  description?: string;
}