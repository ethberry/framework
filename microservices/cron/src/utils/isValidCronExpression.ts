import { CronExpression } from "@nestjs/schedule";

export function isValidCronExpression(schedule: any) {
  return Object.values(CronExpression).includes(schedule);
}
