import { Controller, Get, Param, ParseIntPipe, Query, UseInterceptors } from "@nestjs/common";
import { ApiBearerAuth } from "@nestjs/swagger";

import { NotFoundInterceptor, PaginationInterceptor, User } from "@gemunion/nest-js-utils";

import { MysteryboxTokenService } from "./token.service";
import { UserEntity } from "../../../../user/user.entity";
import { TokenEntity } from "../../../hierarchy/token/token.entity";
import { TokenAutocompleteDto } from "../../../hierarchy/token/dto/autocomplete";
import { TokenSearchDto } from "../../../hierarchy/token/dto";

@ApiBearerAuth()
@Controller("/mysterybox-tokens")
export class MysteryboxTokenController {
  constructor(private readonly mysteryboxTokenService: MysteryboxTokenService) {}

  @Get("/")
  @UseInterceptors(PaginationInterceptor)
  public search(@Query() dto: TokenSearchDto, @User() userEntity: UserEntity): Promise<[Array<TokenEntity>, number]> {
    return this.mysteryboxTokenService.search(dto, userEntity);
  }

  @Get("/autocomplete")
  public autocomplete(@Query() dto: TokenAutocompleteDto): Promise<Array<TokenEntity>> {
    return this.mysteryboxTokenService.autocomplete(dto);
  }

  @Get("/:id")
  @UseInterceptors(NotFoundInterceptor)
  public findOne(@Param("id", ParseIntPipe) id: number): Promise<TokenEntity | null> {
    return this.mysteryboxTokenService.findOneWithRelations({ id });
  }
}
