import { Controller, Get, Param, ParseIntPipe, Query, UseInterceptors } from "@nestjs/common";
import { ApiBearerAuth } from "@nestjs/swagger";

import { NotFoundInterceptor, PaginationInterceptor, User } from "@gemunion/nest-js-utils";

import { MysteryTokenService } from "./token.service";
import { UserEntity } from "../../../../user/user.entity";
import { TokenEntity } from "../../../hierarchy/token/token.entity";
import { TokenAutocompleteDto, TokenSearchDto } from "../../../hierarchy/token/dto";

@ApiBearerAuth()
@Controller("/mystery-tokens")
export class MysteryTokenController {
  constructor(private readonly mysteryboxTokenService: MysteryTokenService) {}

  @Get("/")
  @UseInterceptors(PaginationInterceptor)
  public search(@Query() dto: TokenSearchDto, @User() userEntity: UserEntity): Promise<[Array<TokenEntity>, number]> {
    return this.mysteryboxTokenService.search(dto, userEntity);
  }

  @Get("/autocomplete")
  public autocomplete(@Query() dto: TokenAutocompleteDto, @User() userEntity: UserEntity): Promise<Array<TokenEntity>> {
    return this.mysteryboxTokenService.autocomplete(dto, userEntity);
  }

  @Get("/:id")
  @UseInterceptors(NotFoundInterceptor)
  public findOne(@Param("id", ParseIntPipe) id: number): Promise<TokenEntity | null> {
    return this.mysteryboxTokenService.findOneWithRelations({ id });
  }
}
