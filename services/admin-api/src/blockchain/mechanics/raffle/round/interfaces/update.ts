import { CronExpression } from "@framework/types";

export interface IRaffleScheduleUpdate {
  address: string;
  schedule: CronExpression;
  description?: string;
}
