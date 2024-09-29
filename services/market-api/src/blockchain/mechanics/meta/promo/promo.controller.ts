import { Body, Controller, Get, Post, Query, UseInterceptors } from "@nestjs/common";

import { PaginationInterceptor, Public, User } from "@ethberry/nest-js-utils";
import type { IServerSignature } from "@ethberry/types-blockchain";

import { UserEntity } from "../../../../infrastructure/user/user.entity";
import { AssetPromoService } from "./promo.service";
import { AssetPromoEntity } from "./promo.entity";
import { PromoSignDto, PromoSearchDto } from "./dto";

@Public()
@Controller("/promos")
export class AssetPromoController {
  constructor(private readonly assetPromoService: AssetPromoService) {}

  @Get("/")
  @UseInterceptors(PaginationInterceptor)
  public search(
    @Query() dto: PromoSearchDto,
    @User() userEntity: UserEntity,
  ): Promise<[Array<AssetPromoEntity>, number]> {
    return this.assetPromoService.search(dto, userEntity);
  }

  @Get("/new")
  @UseInterceptors(PaginationInterceptor)
  public getNewTemplates(
    @Query() dto: PromoSearchDto,
    @User() userEntity: UserEntity,
  ): Promise<[Array<AssetPromoEntity>, number]> {
    return this.assetPromoService.search({ ...dto, take: 10 }, userEntity);
  }

  @Post("/sign")
  public sign(@Body() dto: PromoSignDto, @User() userEntity: UserEntity): Promise<IServerSignature> {
    return this.assetPromoService.sign(dto, userEntity);
  }
}
