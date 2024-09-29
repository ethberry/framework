import { Controller, Get, Param, ParseIntPipe, Query, UseInterceptors } from "@nestjs/common";
import { ApiBearerAuth } from "@nestjs/swagger";

import { NotFoundInterceptor, PaginationInterceptor, User } from "@ethberry/nest-js-utils";

import { MerchantEntity } from "../../../../../infrastructure/merchant/merchant.entity";
import { TokenEntity } from "../../../../hierarchy/token/token.entity";
import { TokenAutocompleteDto, TokenSearchDto } from "../../../../hierarchy/token/dto";
import { LootTokenService } from "./token.service";

@ApiBearerAuth()
@Controller("/loot/tokens")
export class LootTokenController {
  constructor(private readonly lootTokenService: LootTokenService) {}

  @Get("/")
  @UseInterceptors(PaginationInterceptor)
  public search(
    @Query() dto: TokenSearchDto,
    @User() merchantEntity: MerchantEntity,
  ): Promise<[Array<TokenEntity>, number]> {
    return this.lootTokenService.search(dto, merchantEntity);
  }

  @Get("/autocomplete")
  public autocomplete(
    @Query() dto: TokenAutocompleteDto,
    @User() merchantEntity: MerchantEntity,
  ): Promise<Array<TokenEntity>> {
    return this.lootTokenService.autocomplete(dto, merchantEntity);
  }

  @Get("/:id")
  @UseInterceptors(NotFoundInterceptor)
  public findOne(
    @Param("id", ParseIntPipe) id: number,
    @User() merchantEntity: MerchantEntity,
  ): Promise<TokenEntity | null> {
    return this.lootTokenService.findOneWithRelationsOrFail({ id }, merchantEntity);
  }
}
