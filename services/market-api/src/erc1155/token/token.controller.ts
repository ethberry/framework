import { Controller, Get, Param, ParseIntPipe, Query, UseInterceptors } from "@nestjs/common";
import { ApiBearerAuth } from "@nestjs/swagger";

import { NotFoundInterceptor, PaginationInterceptor, User } from "@gemunion/nest-js-utils";

import { Erc1155TokenService } from "./token.service";
import { UserEntity } from "../../user/user.entity";
import { TokenEntity } from "../../blockchain/hierarchy/token/token.entity";
import { TokenAutocompleteDto } from "../../blockchain/hierarchy/token/dto/autocomplete";
import { TokenSearchDto } from "../../blockchain/hierarchy/token/dto";

@ApiBearerAuth()
@Controller("/erc1155-tokens")
export class Erc1155TokenController {
  constructor(private readonly erc1155TokenService: Erc1155TokenService) {}

  @Get("/")
  @UseInterceptors(PaginationInterceptor)
  public search(@Query() dto: TokenSearchDto, @User() userEntity: UserEntity): Promise<[Array<TokenEntity>, number]> {
    return this.erc1155TokenService.search(dto, userEntity);
  }

  @Get("/autocomplete")
  public autocomplete(@Query() dto: TokenAutocompleteDto): Promise<Array<TokenEntity>> {
    return this.erc1155TokenService.autocomplete(dto);
  }

  @Get("/:id")
  @UseInterceptors(NotFoundInterceptor)
  public findOne(@Param("id", ParseIntPipe) id: number): Promise<TokenEntity | null> {
    return this.erc1155TokenService.findOneWithRelationslus({ id });
  }
}
