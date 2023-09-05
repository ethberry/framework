import { Controller, Get, Param, ParseIntPipe, Query, UseInterceptors } from "@nestjs/common";

import { NotFoundInterceptor, PaginationInterceptor, User } from "@gemunion/nest-js-utils";
import { MerchantEntity } from "../../../../infrastructure/merchant/merchant.entity";
import { MysteryBoxService } from "./box.service";
import { MysteryBoxEntity } from "./box.entity";
import { MysteryBoxSearchDto } from "./dto";

@Controller("/mystery/boxes")
export class MysteryBoxController {
  constructor(private readonly mysteryBoxService: MysteryBoxService) {}

  @Get("/")
  @UseInterceptors(PaginationInterceptor)
  public search(
    @Query() dto: MysteryBoxSearchDto,
    @User() merchantEntity: MerchantEntity,
  ): Promise<[Array<MysteryBoxEntity>, number]> {
    return this.mysteryBoxService.search(dto, merchantEntity);
  }

  @Get("/autocomplete")
  public autocomplete(@User() merchantEntity: MerchantEntity): Promise<Array<MysteryBoxEntity>> {
    return this.mysteryBoxService.autocomplete(merchantEntity);
  }

  @Get("/:id")
  @UseInterceptors(NotFoundInterceptor)
  public findOne(
    @Param("id", ParseIntPipe) id: number,
    // @User() merchantEntity: MerchantEntity,
  ): Promise<MysteryBoxEntity | null> {
    return this.mysteryBoxService.findOneWithRelations({ id });
  }
}
