import { Controller, Get, Query } from "@nestjs/common";
import { ApiBearerAuth } from "@nestjs/swagger";

import { User } from "@gemunion/nest-js-utils";

import { TokenAutocompleteDto } from "./dto";
import { TokenService } from "./token.service";
import { TokenEntity } from "./token.entity";
import { UserEntity } from "../../../infrastructure/user/user.entity";

@ApiBearerAuth()
@Controller("/tokens")
export class TokenController {
  constructor(private readonly tokenService: TokenService) {}

  @Get("/autocomplete")
  public autocomplete(@Query() dto: TokenAutocompleteDto, @User() userEntity: UserEntity): Promise<Array<TokenEntity>> {
    return this.tokenService.autocomplete(dto, userEntity);
  }
}
