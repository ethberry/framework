import { Controller } from "@nestjs/common";
import { EventPattern, Payload } from "@nestjs/microservices";

import { IRaffleScheduleUpdateDto, RmqProviderType } from "@framework/types";

import { RoundServiceRmq } from "./round.service.rmq";

@Controller()
export class RoundControllerRmq {
  constructor(private readonly roundServiceRmq: RoundServiceRmq) {}

  @EventPattern(RmqProviderType.SCHEDULE_SERVICE_RAFFLE)
  async updateSchedule(@Payload() dto: IRaffleScheduleUpdateDto): Promise<void> {
    return this.roundServiceRmq.updateSchedule(dto);
  }
}
