import { Controller } from "@nestjs/common";
import { EventPattern, Payload } from "@nestjs/microservices";

import type { IRaffleScheduleUpdateRmq } from "@framework/types";
import { RmqProviderType } from "@framework/types";

import { RoundServiceRmq } from "./round.service.rmq";

@Controller()
export class RoundControllerRmq {
  constructor(private readonly roundServiceRmq: RoundServiceRmq) {}

  @EventPattern(RmqProviderType.SCHEDULE_SERVICE_RAFFLE)
  async updateSchedule(@Payload() dto: IRaffleScheduleUpdateRmq): Promise<void> {
    return this.roundServiceRmq.updateSchedule(dto);
  }
}
