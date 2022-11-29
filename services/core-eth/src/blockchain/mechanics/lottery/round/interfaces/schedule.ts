import { CronExpression } from "@nestjs/schedule";

export interface ILotteryScheduleDto {
  roundSchedule: CronExpression;
  description?: string;
}

// TODO move to packages/types ?
export interface ILotteryOption {
  roundSchedule: CronExpression;
  description?: string;
}
