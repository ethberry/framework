import { Controller, Get, Query } from "@nestjs/common";

import { Public } from "@gemunion/nest-js-utils";

import { EventHistorySearchDto } from "./dto";
import { EventHistoryService } from "./event-history.service";
import { EventHistoryEntity } from "./event-history.entity";

@Public()
@Controller("/events")
export class EventHistoryControllerPublic {
  constructor(private readonly eventHistoryService: EventHistoryService) {}

  @Get("/token/search")
  public search(@Query() dto: EventHistorySearchDto): Promise<[Array<EventHistoryEntity>, number]> {
    return this.eventHistoryService.search(dto);
  }
}
