import { Controller, Get, Query } from "@nestjs/common";
import { ApiBearerAuth } from "@nestjs/swagger";

import { TokenAutocompleteDto } from "./dto";
import { TokenService } from "./token.service";
import { TokenEntity } from "./token.entity";

@ApiBearerAuth()
@Controller("/tokens")
export class TokenController {
  constructor(private readonly tokenService: TokenService) {}

  @Get("/autocomplete")
  public autocomplete(@Query() dto: TokenAutocompleteDto): Promise<Array<TokenEntity>> {
    return this.tokenService.autocomplete(dto);
  }
}
