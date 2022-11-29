import { CronExpression } from "@nestjs/schedule";

// TODO move to packages/types ?
export interface ILotteryOption {
  roundSchedule: CronExpression;
  description?: string;
}
