import { Controller } from "@nestjs/common";
import { EventPattern, Payload } from "@nestjs/microservices";

import type { ILotteryScheduleUpdateRmq } from "@framework/types";
import { RmqProviderType } from "@framework/types";

import { LotteryRoundServiceRmq } from "./round.service.rmq";

@Controller()
export class RoundControllerRmq {
  constructor(private readonly roundServiceRmq: LotteryRoundServiceRmq) {}

  @EventPattern(RmqProviderType.SCHEDULE_SERVICE_LOTTERY)
  async updateSchedule(@Payload() dto: ILotteryScheduleUpdateRmq): Promise<void> {
    return this.roundServiceRmq.updateSchedule(dto);
  }
}
