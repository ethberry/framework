import { Controller, Get, Param, ParseIntPipe, Query, UseInterceptors } from "@nestjs/common";
import { ApiBearerAuth } from "@nestjs/swagger";

import { NotFoundInterceptor, PaginationInterceptor, User } from "@gemunion/nest-js-utils";

import { MerchantEntity } from "../../../../infrastructure/merchant/merchant.entity";
import { TokenEntity } from "../../../hierarchy/token/token.entity";
import { TokenAutocompleteDto, TokenSearchDto } from "../../../hierarchy/token/dto";
import { MysteryTokenService } from "./token.service";

@ApiBearerAuth()
@Controller("/mystery/tokens")
export class MysteryTokenController {
  constructor(private readonly mysteryTokenService: MysteryTokenService) {}

  @Get("/")
  @UseInterceptors(PaginationInterceptor)
  public search(
    @Query() dto: TokenSearchDto,
    @User() merchantEntity: MerchantEntity,
  ): Promise<[Array<TokenEntity>, number]> {
    return this.mysteryTokenService.search(dto, merchantEntity);
  }

  @Get("/autocomplete")
  public autocomplete(
    @Query() dto: TokenAutocompleteDto,
    @User() merchantEntity: MerchantEntity,
  ): Promise<Array<TokenEntity>> {
    return this.mysteryTokenService.autocomplete(dto, merchantEntity);
  }

  @Get("/:id")
  @UseInterceptors(NotFoundInterceptor)
  public findOne(@Param("id", ParseIntPipe) id: number): Promise<TokenEntity | null> {
    return this.mysteryTokenService.findOneWithRelations({ id });
  }
}
