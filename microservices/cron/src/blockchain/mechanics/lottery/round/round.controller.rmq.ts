import { Controller } from "@nestjs/common";
import { EventPattern, Payload } from "@nestjs/microservices";

import type { ILotteryScheduleUpdateRmq } from "@framework/types";
import { CronType } from "@framework/types";

import { LotteryRoundServiceRmq } from "./round.service.rmq";

@Controller()
export class RoundControllerRmq {
  constructor(private readonly roundServiceRmq: LotteryRoundServiceRmq) {}

  @EventPattern(CronType.SCHEDULE_LOTTERY_ROUND)
  async updateSchedule(@Payload() dto: ILotteryScheduleUpdateRmq): Promise<void> {
    return this.roundServiceRmq.updateSchedule(dto);
  }
}
