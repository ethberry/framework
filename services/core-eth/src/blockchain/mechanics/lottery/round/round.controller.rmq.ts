import { Controller } from "@nestjs/common";
import { EventPattern, Payload } from "@nestjs/microservices";
import { RmqProviderType } from "@framework/types";
import { RoundServiceRmq } from "./round.service.rmq";
import { ILotteryScheduleDto } from "./interfaces";

@Controller()
export class RoundControllerRmq {
  constructor(private readonly roundServiceRmq: RoundServiceRmq) {}

  @EventPattern(RmqProviderType.SCHEDULE_SERVICE)
  async updateSchedule(@Payload() dto: ILotteryScheduleDto): Promise<void> {
    return this.roundServiceRmq.updateSchedule(dto);
  }
}
