import { Controller } from "@nestjs/common";
import { EventPattern, Payload } from "@nestjs/microservices";

import { CoreEthType } from "@framework/types";

import { LotteryRoundServiceRmq } from "./round.service.rmq";
import { LotteryScheduleUpdateDto } from "./dto";

@Controller()
export class RoundControllerRmq {
  constructor(private readonly lotteryRoundServiceRmq: LotteryRoundServiceRmq) {}

  @EventPattern(CoreEthType.START_LOTTERY_ROUND)
  async updateSchedule(@Payload() dto: LotteryScheduleUpdateDto): Promise<void> {
    return this.lotteryRoundServiceRmq.startRound(dto);
  }
}
