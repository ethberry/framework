import { Body, Controller, Post } from "@nestjs/common";
import { ApiBearerAuth } from "@nestjs/swagger";

import { EventService } from "./event.service";
import { MessageDto } from "./dto";

@ApiBearerAuth()
@Controller("/event")
export class EventController {
  constructor(private readonly eventService: EventService) {}

  @Post("/test")
  public sendMessage(@Body() dto: MessageDto): void {
    console.info("event/test", dto);
    return this.eventService.sendMessage(dto);
  }
}
