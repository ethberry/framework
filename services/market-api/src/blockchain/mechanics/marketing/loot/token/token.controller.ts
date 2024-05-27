import { Controller, Get, Param, ParseIntPipe, Query, UseInterceptors } from "@nestjs/common";
import { ApiBearerAuth } from "@nestjs/swagger";

import { NotFoundInterceptor, PaginationInterceptor, User } from "@gemunion/nest-js-utils";

import { UserEntity } from "../../../../../infrastructure/user/user.entity";
import { TokenEntity } from "../../../../hierarchy/token/token.entity";
import { TokenAutocompleteDto, TokenSearchDto } from "../../../../hierarchy/token/dto";
import { LootTokenService } from "./token.service";

@ApiBearerAuth()
@Controller("/loot/tokens")
export class LootTokenController {
  constructor(private readonly lootTokenService: LootTokenService) {}

  @Get("/")
  @UseInterceptors(PaginationInterceptor)
  public search(@Query() dto: TokenSearchDto, @User() userEntity: UserEntity): Promise<[Array<TokenEntity>, number]> {
    return this.lootTokenService.search(dto, userEntity);
  }

  @Get("/autocomplete")
  public autocomplete(@Query() dto: TokenAutocompleteDto, @User() userEntity: UserEntity): Promise<Array<TokenEntity>> {
    return this.lootTokenService.autocomplete(dto, userEntity);
  }

  @Get("/:id")
  @UseInterceptors(NotFoundInterceptor)
  public findOne(@Param("id", ParseIntPipe) id: number): Promise<TokenEntity | null> {
    return this.lootTokenService.findOneWithRelations({ id });
  }
}
