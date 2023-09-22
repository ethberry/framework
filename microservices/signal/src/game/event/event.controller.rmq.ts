import { Body, Controller } from "@nestjs/common";
import { EventPattern } from "@nestjs/microservices";

import { SignalEventType } from "@framework/types";

import { EventService } from "./event.service";
import type { ISignalMessageDto } from "./interfaces";

@Controller()
export class EventControllerRmq {
  constructor(private readonly eventService: EventService) {}

  @EventPattern(SignalEventType.TRANSACTION_HASH)
  public sendMessage(@Body() dto: ISignalMessageDto): void {
    return this.eventService.sendMessage(dto);
  }
}
