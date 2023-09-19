import { Body, Controller, Get, Param, ParseIntPipe, Post, Query, UseInterceptors } from "@nestjs/common";

import { NotFoundInterceptor, PaginationInterceptor, User } from "@gemunion/nest-js-utils";
import { SearchDto } from "@gemunion/collection";
import type { IServerSignature } from "@gemunion/types-blockchain";

import { MerchantEntity } from "../../../../infrastructure/merchant/merchant.entity";
import { DismantleService } from "./dismantle.service";
import { DismantleEntity } from "./dismantle.entity";
import { DismantleSignDto } from "./dto";

@Controller("/dismantle")
export class DismantleController {
  constructor(private readonly dismantleService: DismantleService) {}

  @Get("/")
  @UseInterceptors(PaginationInterceptor)
  public search(
    @Query() dto: SearchDto,
    @User() merchantEntity: MerchantEntity,
  ): Promise<[Array<DismantleEntity>, number]> {
    return this.dismantleService.search(dto, merchantEntity);
  }

  @Post("/sign")
  public sign(@Body() dto: DismantleSignDto, @User() merchantEntity: MerchantEntity): Promise<IServerSignature> {
    return this.dismantleService.sign(dto, merchantEntity);
  }

  @Get("/:id")
  @UseInterceptors(NotFoundInterceptor)
  public findOne(
    @Param("id", ParseIntPipe) id: number,
    @User() merchantEntity: MerchantEntity,
  ): Promise<DismantleEntity | null> {
    return this.dismantleService.findOneWithRelations({ id }, merchantEntity);
  }
}
