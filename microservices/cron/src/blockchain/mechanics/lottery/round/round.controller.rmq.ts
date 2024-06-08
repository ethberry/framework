import { Controller } from "@nestjs/common";
import { EventPattern, Payload } from "@nestjs/microservices";

import { CronType } from "@framework/types";

import { LotteryScheduleUpdateDto } from "./dto";
import { LotteryRoundServiceRmq } from "./round.service.rmq";

@Controller()
export class RoundControllerRmq {
  constructor(private readonly roundServiceRmq: LotteryRoundServiceRmq) {}

  @EventPattern(CronType.SCHEDULE_LOTTERY_ROUND)
  async updateSchedule(@Payload() dto: LotteryScheduleUpdateDto): Promise<void> {
    return this.roundServiceRmq.updateSchedule(dto);
  }
}
