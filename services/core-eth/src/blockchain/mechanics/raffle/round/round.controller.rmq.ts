import { Controller } from "@nestjs/common";
import { EventPattern, Payload } from "@nestjs/microservices";

import { IRaffleOption, RmqProviderType } from "@framework/types";

import { RoundServiceRmq } from "./round.service.rmq";

@Controller()
export class RoundControllerRmq {
  constructor(private readonly roundServiceRmq: RoundServiceRmq) {}

  @EventPattern(RmqProviderType.SCHEDULE_SERVICE)
  async updateSchedule(@Payload() dto: IRaffleOption): Promise<void> {
    return this.roundServiceRmq.updateSchedule(dto);
  }
}