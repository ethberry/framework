import { Controller } from "@nestjs/common";
import { EventPattern, Payload } from "@nestjs/microservices";

import { CronType } from "@framework/types";

import { RaffleRoundServiceRmq } from "./round.service.rmq";
import { RaffleScheduleUpdateRmqDto } from "./dto";

@Controller()
export class RoundControllerRmq {
  constructor(private readonly roundServiceRmq: RaffleRoundServiceRmq) {}

  @EventPattern(CronType.SCHEDULE_RAFFLE_ROUND)
  async updateSchedule(@Payload() dto: RaffleScheduleUpdateRmqDto): Promise<void> {
    return this.roundServiceRmq.updateSchedule(dto);
  }
}
