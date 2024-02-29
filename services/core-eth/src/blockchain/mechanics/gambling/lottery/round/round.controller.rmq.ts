import { Controller } from "@nestjs/common";
import { EventPattern, Payload } from "@nestjs/microservices";

import type { ILotteryScheduleUpdateRmq } from "@framework/types";
import { CoreEthType } from "@framework/types";

import { LotteryRoundServiceRmq } from "./round.service.rmq";

@Controller()
export class RoundControllerRmq {
  constructor(private readonly lotteryRoundServiceRmq: LotteryRoundServiceRmq) {}

  @EventPattern(CoreEthType.START_LOTTERY_ROUND)
  async updateSchedule(@Payload() dto: ILotteryScheduleUpdateRmq): Promise<void> {
    return this.lotteryRoundServiceRmq.startRound(dto);
  }
}
