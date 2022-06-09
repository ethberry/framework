import { Controller, Get, Query } from "@nestjs/common";

import { Public } from "@gemunion/nest-js-utils";

import { Erc20TokenService } from "./token.service";
import { Erc20TokenEntity } from "./token.entity";
import { Erc20TokenAutocompleteDto } from "./dto/autocomplete";

@Public()
@Controller("/erc20-tokens")
export class Erc20TokenController {
  constructor(private readonly erc20TokenService: Erc20TokenService) {}

  @Get("/autocomplete")
  public autocomplete(@Query() dto: Erc20TokenAutocompleteDto): Promise<Array<Erc20TokenEntity>> {
    return this.erc20TokenService.autocomplete(dto);
  }
}
