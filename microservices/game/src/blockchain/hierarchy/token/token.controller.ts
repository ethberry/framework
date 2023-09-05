import { Controller, Get, Param, ParseIntPipe, Query, UseInterceptors } from "@nestjs/common";
import { ApiBearerAuth } from "@nestjs/swagger";

import { NotFoundInterceptor, PaginationInterceptor, User } from "@gemunion/nest-js-utils";
import { ModuleType, TokenType } from "@framework/types";

import { MerchantEntity } from "../../../infrastructure/merchant/merchant.entity";
import { TokenService } from "./token.service";
import { TokenEntity } from "./token.entity";
import { TokenAutocompleteDto, TokenSearchDto } from "./dto";

@ApiBearerAuth()
@Controller("/tokens")
export class TokenController {
  constructor(private readonly tokenService: TokenService) {}

  @Get("/search")
  @UseInterceptors(PaginationInterceptor)
  public search(
    @Query() dto: TokenSearchDto,
    @User() merchantEntity: MerchantEntity,
  ): Promise<[Array<TokenEntity>, number]> {
    return this.tokenService.search(
      dto,
      merchantEntity,
      [
        ModuleType.HIERARCHY,
        ModuleType.COLLECTION,
        ModuleType.MYSTERY,
        ModuleType.WRAPPER,
        ModuleType.LOTTERY,
        ModuleType.RAFFLE,
      ],
      [TokenType.ERC721, TokenType.ERC998, TokenType.ERC1155],
    );
  }

  @Get("/autocomplete")
  public autocomplete(
    @Query() dto: TokenAutocompleteDto,
    @User() merchantEntity: MerchantEntity,
  ): Promise<Array<TokenEntity>> {
    return this.tokenService.autocomplete(dto, merchantEntity);
  }

  @Get("/:id")
  @UseInterceptors(NotFoundInterceptor)
  public findOne(
    @Param("id", ParseIntPipe) id: number,
    @User() merchantEntity: MerchantEntity,
  ): Promise<TokenEntity | null> {
    return this.tokenService.findOneWithRelations({ id }, merchantEntity);
  }
}
