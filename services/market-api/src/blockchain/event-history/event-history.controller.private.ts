import { Controller, Get, Query, UseInterceptors } from "@nestjs/common";
import { ApiBearerAuth } from "@nestjs/swagger";

import { PaginationInterceptor, User } from "@gemunion/nest-js-utils";
import { PaginationDto } from "@gemunion/collection";

import { EventHistoryService } from "./event-history.service";
import { EventHistoryEntity } from "./event-history.entity";
import { UserEntity } from "../../infrastructure/user/user.entity";

@ApiBearerAuth()
@Controller("/events")
export class EventHistoryControllerPrivate {
  constructor(private readonly eventHistoryService: EventHistoryService) {}

  @Get("/my")
  @UseInterceptors(PaginationInterceptor)
  public my(@Query() dto: PaginationDto, @User() userEntity: UserEntity): Promise<[Array<EventHistoryEntity>, number]> {
    return this.eventHistoryService.my(dto, userEntity);
  }
}
