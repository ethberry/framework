import { Controller, Get, Query, UseInterceptors } from "@nestjs/common";
import { ApiBearerAuth } from "@nestjs/swagger";

import { PaginationInterceptor, User } from "@gemunion/nest-js-utils";
import { ModuleType, TokenType } from "@framework/types";

import { TokenAutocompleteDto, TokenSearchDto } from "./dto";
import { TokenService } from "./token.service";
import { TokenEntity } from "./token.entity";
import { UserEntity } from "../../../infrastructure/user/user.entity";

@ApiBearerAuth()
@Controller("/tokens")
export class TokenController {
  constructor(private readonly tokenService: TokenService) {}

  @Get("/search")
  @UseInterceptors(PaginationInterceptor)
  public search(@Query() dto: TokenSearchDto, @User() userEntity: UserEntity): Promise<[Array<TokenEntity>, number]> {
    return this.tokenService.search(
      dto,
      userEntity,
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
  public autocomplete(@Query() dto: TokenAutocompleteDto, @User() userEntity: UserEntity): Promise<Array<TokenEntity>> {
    return this.tokenService.autocomplete(dto, userEntity);
  }
}
