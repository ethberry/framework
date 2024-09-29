import { Body, Controller, Get, Post, UseInterceptors } from "@nestjs/common";
import { ApiBearerAuth } from "@nestjs/swagger";

import { PaginationInterceptor, User } from "@ethberry/nest-js-utils";

import { UserEntity } from "../../../../../infrastructure/user/user.entity";
import { WaitListItemService } from "./item.service";
import { WaitListItemEntity } from "./item.entity";
import { WaitListItemCreateDto, WaitListProofDto } from "./dto";

@ApiBearerAuth()
@Controller("/wait-list/item")
export class WaitListItemController {
  constructor(private readonly waitListItemService: WaitListItemService) {}

  @Get("/")
  @UseInterceptors(PaginationInterceptor)
  public search(@User() userEntity: UserEntity): Promise<[Array<WaitListItemEntity>, number]> {
    return this.waitListItemService.search(userEntity);
  }

  @Post("/")
  public create(@Body() dto: WaitListItemCreateDto): Promise<WaitListItemEntity> {
    return this.waitListItemService.create(dto);
  }

  @Post("/proof")
  public proof(@Body() dto: WaitListProofDto, @User() userEntity: UserEntity): Promise<{ proof: Array<string> }> {
    return this.waitListItemService.proof(dto, userEntity);
  }
}
