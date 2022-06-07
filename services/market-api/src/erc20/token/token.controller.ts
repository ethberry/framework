import { Controller, Get } from "@nestjs/common";
import { ApiBearerAuth } from "@nestjs/swagger";

import { Erc20TokenService } from "./token.service";
import { Erc20TokenEntity } from "./token.entity";

@ApiBearerAuth()
@Controller("/erc20-tokens")
export class Erc20TokenController {
  constructor(private readonly erc20TokenService: Erc20TokenService) {}

  @Get("/autocomplete")
  public autocomplete(): Promise<Array<Erc20TokenEntity>> {
    return this.erc20TokenService.autocomplete();
  }
}
