import { Body, Controller, Get, Post, Query, UseInterceptors } from "@nestjs/common";

import { PaginationInterceptor, Public } from "@gemunion/nest-js-utils";
import type { IServerSignature } from "@gemunion/types-blockchain";

import { AssetPromoService } from "./promo.service";
import { AssetPromoEntity } from "./promo.entity";
import { AssetPromoSignDto, PromoSearchDto } from "./dto";

@Public()
@Controller("/promos")
export class AssetPromoController {
  constructor(private readonly assetPromoService: AssetPromoService) {}

  @Get("/")
  @UseInterceptors(PaginationInterceptor)
  public search(@Query() dto: PromoSearchDto): Promise<[Array<AssetPromoEntity>, number]> {
    return this.assetPromoService.search(dto);
  }

  @Get("/new")
  @UseInterceptors(PaginationInterceptor)
  public getNewTemplates(@Query() dto: PromoSearchDto): Promise<[Array<AssetPromoEntity>, number]> {
    return this.assetPromoService.search({ ...dto, take: 10 });
  }

  @Post("/sign")
  public sign(@Body() dto: AssetPromoSignDto): Promise<IServerSignature> {
    return this.assetPromoService.sign(dto);
  }
}
