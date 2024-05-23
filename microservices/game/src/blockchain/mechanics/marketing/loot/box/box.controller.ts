import { Controller, Get, Param, ParseIntPipe, Query, UseInterceptors } from "@nestjs/common";

import { NotFoundInterceptor, PaginationInterceptor, User } from "@gemunion/nest-js-utils";
import { MerchantEntity } from "../../../../../infrastructure/merchant/merchant.entity";
import { LootBoxService } from "./box.service";
import { LootBoxEntity } from "./box.entity";
import { LootBoxSearchDto } from "./dto";

@Controller("/loot/boxes")
export class LootBoxController {
  constructor(private readonly lootBoxService: LootBoxService) {}

  @Get("/")
  @UseInterceptors(PaginationInterceptor)
  public search(
    @Query() dto: LootBoxSearchDto,
    @User() merchantEntity: MerchantEntity,
  ): Promise<[Array<LootBoxEntity>, number]> {
    return this.lootBoxService.search(dto, merchantEntity);
  }

  @Get("/autocomplete")
  public autocomplete(@User() merchantEntity: MerchantEntity): Promise<Array<LootBoxEntity>> {
    return this.lootBoxService.autocomplete(merchantEntity);
  }

  @Get("/:id")
  @UseInterceptors(NotFoundInterceptor)
  public findOne(
    @Param("id", ParseIntPipe) id: number,
    @User() merchantEntity: MerchantEntity,
  ): Promise<LootBoxEntity | null> {
    return this.lootBoxService.findOneWithRelationsOrFail({ id }, merchantEntity);
  }
}
