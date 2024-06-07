import { Controller } from "@nestjs/common";
import { EventPattern, Payload } from "@nestjs/microservices";

import { CronType } from "@framework/types";

import { LotteryScheduleUpdateDto } from "./dto/update";
import { LotteryRoundServiceRmq } from "./round.service.rmq";
import { ValidationDtoPipe } from "../../../../common/utils/ValidationDtoPipe";

@Controller()
export class RoundControllerRmq {
  constructor(private readonly roundServiceRmq: LotteryRoundServiceRmq) {}

  @EventPattern(CronType.SCHEDULE_LOTTERY_ROUND)
  async updateSchedule(@Payload(ValidationDtoPipe) dto: LotteryScheduleUpdateDto): Promise<void> {
    return this.roundServiceRmq.updateSchedule(dto);
  }
}
