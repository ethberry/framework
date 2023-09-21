import { Controller } from "@nestjs/common";
import { EventPattern, Payload } from "@nestjs/microservices";

import type { IRaffleScheduleUpdateRmq } from "@framework/types";
import { CronType } from "@framework/types";

import { RaffleRoundServiceRmq } from "./round.service.rmq";

@Controller()
export class RoundControllerRmq {
  constructor(private readonly roundServiceRmq: RaffleRoundServiceRmq) {}

  @EventPattern(CronType.SCHEDULE_RAFFLE_ROUND)
  async updateSchedule(@Payload() dto: IRaffleScheduleUpdateRmq): Promise<void> {
    return this.roundServiceRmq.updateSchedule(dto);
  }
}
