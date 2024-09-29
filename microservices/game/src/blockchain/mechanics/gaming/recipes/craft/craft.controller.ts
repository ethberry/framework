import { Body, Controller, Get, Param, ParseIntPipe, Post, Query, UseInterceptors } from "@nestjs/common";

import { NotFoundInterceptor, PaginationInterceptor, User } from "@ethberry/nest-js-utils";
import { SearchDto } from "@ethberry/collection";
import type { IServerSignature } from "@ethberry/types-blockchain";

import { MerchantEntity } from "../../../../../infrastructure/merchant/merchant.entity";
import { CraftService } from "./craft.service";
import { CraftEntity } from "./craft.entity";
import { SignCraftDto } from "./dto";

@Controller("/craft")
export class CraftController {
  constructor(private readonly craftService: CraftService) {}

  @Get("/")
  @UseInterceptors(PaginationInterceptor)
  public search(
    @Query() dto: SearchDto,
    @User() merchantEntity: MerchantEntity,
  ): Promise<[Array<CraftEntity>, number]> {
    return this.craftService.search(dto, merchantEntity);
  }

  @Post("/sign")
  public sign(@Body() dto: SignCraftDto, @User() merchantEntity: MerchantEntity): Promise<IServerSignature> {
    return this.craftService.sign(dto, merchantEntity);
  }

  @Get("/:id")
  @UseInterceptors(NotFoundInterceptor)
  public findOne(
    @Param("id", ParseIntPipe) id: number,
    @User() merchantEntity: MerchantEntity,
  ): Promise<CraftEntity | null> {
    return this.craftService.findOneWithRelations({ id }, merchantEntity);
  }
}
