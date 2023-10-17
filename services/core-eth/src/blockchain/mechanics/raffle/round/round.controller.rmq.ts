import { Controller } from "@nestjs/common";
import { EventPattern, Payload } from "@nestjs/microservices";

import type { IRaffleScheduleUpdateRmq } from "@framework/types";
import { CoreEthType } from "@framework/types";

import { RaffleRoundServiceRmq } from "./round.service.rmq";

@Controller()
export class RoundControllerRmq {
  constructor(private readonly raffleRoundServiceRmq: RaffleRoundServiceRmq) {}

  @EventPattern(CoreEthType.START_RAFFLE_ROUND)
  async updateSchedule(@Payload() dto: IRaffleScheduleUpdateRmq): Promise<void> {
    return this.raffleRoundServiceRmq.startRound(dto);
  }
}
