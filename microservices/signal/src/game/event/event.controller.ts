import { Controller, Post, Body } from "@nestjs/common";

import { EventService } from "./event.service";
import { MessageDto } from "./dto";

@Controller("/event")
export class EventController {
  constructor(private readonly eventService: EventService) {}

  @Post("/test")
  public sendMessage(@Body() dto: MessageDto): void {
    return this.eventService.sendMessage(dto);
  }
}
