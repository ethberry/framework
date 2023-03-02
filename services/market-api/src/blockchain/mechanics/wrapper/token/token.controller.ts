import { Controller, Get, Param, ParseIntPipe, Query, UseInterceptors } from "@nestjs/common";
import { ApiBearerAuth } from "@nestjs/swagger";

import { NotFoundInterceptor, PaginationInterceptor, User } from "@gemunion/nest-js-utils";

import { WrapperTokenService } from "./token.service";
import { UserEntity } from "../../../../infrastructure/user/user.entity";
import { TokenEntity } from "../../../hierarchy/token/token.entity";
import { TokenAutocompleteDto, TokenSearchDto } from "../../../hierarchy/token/dto";

@ApiBearerAuth()
@Controller("/wrapper-tokens")
export class WrapperTokenController {
  constructor(private readonly wrapperboxTokenService: WrapperTokenService) {}

  @Get("/")
  @UseInterceptors(PaginationInterceptor)
  public search(@Query() dto: TokenSearchDto, @User() userEntity: UserEntity): Promise<[Array<TokenEntity>, number]> {
    return this.wrapperboxTokenService.search(dto, userEntity);
  }

  @Get("/autocomplete")
  public autocomplete(@Query() dto: TokenAutocompleteDto, @User() userEntity: UserEntity): Promise<Array<TokenEntity>> {
    return this.wrapperboxTokenService.autocomplete(dto, userEntity);
  }

  @Get("/:id")
  @UseInterceptors(NotFoundInterceptor)
  public findOne(@Param("id", ParseIntPipe) id: number): Promise<TokenEntity | null> {
    return this.wrapperboxTokenService.findOneWithRelations({ id });
  }
}
