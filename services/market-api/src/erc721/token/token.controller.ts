import { Controller, Get, Param, ParseIntPipe, Query, UseInterceptors } from "@nestjs/common";
import { ApiBearerAuth } from "@nestjs/swagger";

import { NotFoundInterceptor, PaginationInterceptor, User } from "@gemunion/nest-js-utils";

import { Erc721TokenService } from "./token.service";
import { Erc721AssetSearchDto } from "./dto";
import { UserEntity } from "../../user/user.entity";
import { Erc721TokenAutocompleteDto } from "./dto/autocomplete";
import { TokenEntity } from "../../blockchain/hierarchy/token/token.entity";

@ApiBearerAuth()
@Controller("/erc721-tokens")
export class Erc721TokenController {
  constructor(private readonly erc721TokenService: Erc721TokenService) {}

  @Get("/")
  @UseInterceptors(PaginationInterceptor)
  public search(
    @Query() dto: Erc721AssetSearchDto,
    @User() userEntity: UserEntity,
  ): Promise<[Array<TokenEntity>, number]> {
    return this.erc721TokenService.search(dto, userEntity);
  }

  @Get("/autocomplete")
  public autocomplete(@Query() dto: Erc721TokenAutocompleteDto): Promise<Array<TokenEntity>> {
    return this.erc721TokenService.autocomplete(dto);
  }

  @Get("/:id")
  @UseInterceptors(NotFoundInterceptor)
  public findOne(@Param("id", ParseIntPipe) id: number): Promise<TokenEntity | null> {
    return this.erc721TokenService.findOnePlus({ id });
  }
}
