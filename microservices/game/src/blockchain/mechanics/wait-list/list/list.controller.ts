import { Controller, Get, Param, ParseIntPipe, Query, UseInterceptors } from "@nestjs/common";
import { ApiBearerAuth } from "@nestjs/swagger";

import { NotFoundInterceptor, PaginationInterceptor, User } from "@gemunion/nest-js-utils";
import { SearchDto } from "@gemunion/collection";

import { MerchantEntity } from "../../../../infrastructure/merchant/merchant.entity";
import { WaitListListService } from "./list.service";
import { WaitListListEntity } from "./list.entity";

@ApiBearerAuth()
@Controller("/wait-list/list")
export class WaitListListController {
  constructor(private readonly waitListListService: WaitListListService) {}

  @Get("/")
  @UseInterceptors(PaginationInterceptor)
  public search(
    @Query() dto: SearchDto,
    @User() merchantEntity: MerchantEntity,
  ): Promise<[Array<WaitListListEntity>, number]> {
    return this.waitListListService.search(dto, merchantEntity);
  }

  @Get("/:id")
  @UseInterceptors(NotFoundInterceptor)
  public findOne(@Param("id", ParseIntPipe) id: number): Promise<WaitListListEntity | null> {
    return this.waitListListService.findOneWithRelations({ id });
  }
}
