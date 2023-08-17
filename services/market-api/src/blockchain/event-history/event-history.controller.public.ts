import { Controller, Get, Query, UseInterceptors } from "@nestjs/common";

import { PaginationInterceptor, Public } from "@gemunion/nest-js-utils";

import { EventHistoryCraftSearchDto, EventHistoryTokenSearchDto } from "./dto";
import { EventHistoryService } from "./event-history.service";
import { EventHistoryEntity } from "./event-history.entity";

@Public()
@Controller("/events")
export class EventHistoryControllerPublic {
  constructor(private readonly eventHistoryService: EventHistoryService) {}

  @Get("/token")
  public token(@Query() dto: EventHistoryTokenSearchDto): Promise<[Array<EventHistoryEntity>, number]> {
    return this.eventHistoryService.token(dto);
  }

  @Get("/craft")
  @UseInterceptors(PaginationInterceptor)
  public craft(@Query() dto: EventHistoryCraftSearchDto): Promise<[Array<EventHistoryEntity>, number]> {
    return this.eventHistoryService.craft(dto);
  }
}
